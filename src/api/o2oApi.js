import { getLocalStorage, setLocalStorage } from "../javascripts/lib/helpers";
import * as axios from 'axios';

const BASE_URL = `https://api.gtmjs.com/api/zendesk`;

class o2oApi {
    constructor(token, leadId = '') {
        this.leadId = leadId;
        this.token = token;
        this.config = {
            headers: { 'token': token }
        }
        this.getLeadFromPhoneOrEmail = this._getLeadFromPhoneOrEmail.bind(this);
        this.getInteractionHistory = this._getInteractionHistory.bind(this);
        this.getLeadData = this._getLeadData.bind(this);
        this.getDetailHistoryWebAccess = this._getDetailHistoryWebAccess.bind(this);
        this.getLeadActivities = this._getLeadActivities.bind(this);
    }
    _getInteractionHistory() {
        return {
            "from": 0,
            "size": 10,
            "total": 5,
            "data": [
                {
                    "id": "5d3fba40c864430010c42c82",
                    "type": "edit",
                    "note": "",
                    "createdBy": "demo@twin.vn",
                    "createdAt": "2019-07-30T03:32:16.5369072Z",
                    "companyId": "5b67edab965eaf000d446a8e",
                    "objectId": "5d3fafa5c9815e0010bea5ea",
                    "objectType": "lead",
                    "currentStatus": "updateLead",
                    "previousStatus": null,
                    "extension": null
                },
                {
                    "id": "5d3fba40c9815e0010bea704",
                    "type": "editCalendar",
                    "note": null,
                    "createdBy": "demo@twin.vn",
                    "createdAt": "2019-07-30T03:32:16.3678109Z",
                    "companyId": "5b67edab965eaf000d446a8e",
                    "objectId": "5d3fafa5c9815e0010bea5ea",
                    "objectType": "lead",
                    "currentStatus": "createCalendar",
                    "previousStatus": null,
                    "extension": "5d3fba40c9815e0010bea703"
                },
                {
                    "id": "5d3fba3fc864430010c42c81",
                    "type": "note",
                    "note": "test",
                    "createdBy": "demo@twin.vn",
                    "createdAt": "2019-07-30T03:32:15.7253726Z",
                    "companyId": "5b67edab965eaf000d446a8e",
                    "objectId": "5d3fafa5c9815e0010bea5ea",
                    "objectType": "lead",
                    "currentStatus": "editNote",
                    "previousStatus": null,
                    "extension": null
                },
                {
                    "id": "5d3fafa5c864430010c42b6a",
                    "type": "assignment",
                    "note": "",
                    "createdBy": "demo@twin.vn",
                    "createdAt": "2019-07-30T02:47:01.5365831Z",
                    "companyId": "5b67edab965eaf000d446a8e",
                    "objectId": "5d3fafa5c9815e0010bea5ea",
                    "objectType": "lead",
                    "currentStatus": "5b67ed98baa6cd000d518ccd",
                    "previousStatus": null,
                    "extension": null
                },
                {
                    "id": "5d3fafa5c9815e0010bea5eb",
                    "type": "edit",
                    "note": "",
                    "createdBy": "demo@twin.vn",
                    "createdAt": "2019-07-30T02:47:01.5356116Z",
                    "companyId": "5b67edab965eaf000d446a8e",
                    "objectId": "5d3fafa5c9815e0010bea5ea",
                    "objectType": "lead",
                    "currentStatus": "createLead",
                    "previousStatus": null,
                    "extension": null
                }
            ],
            "aggsResult": {}
        }
    }

    async _getLeadFromPhoneOrEmail(zenUser) {
        try {
            const res = await axios.get(`${BASE_URL}/lead?phone=${zenUser.phone}&email=${zenUser.email}`, this.config);
            // const res = await axios.post(`${BASE_URL}/lead`,zenUser, this.config);
            return res;
        } catch (err) {
            debugger;
            if (err.response && err.response.status === 401){
                throw "We can't authorize your token! please make sure your token is correct"
            } else {
                throw "We can't connect to server please check your network or contact our team contact@twin.vn"
            }
        }
    }

    async _getLeadData(zenUser, org) {
        if (zenUser.id) {
            try {
                const data = (await this.getLeadFromPhoneOrEmail(zenUser)).data.data;
                if (Object.keys(data).length === 0)
                    throw "We can't find this lead on O2O!"
                this.leadId = data.info.id;
                setLocalStorage('leadId', this.leadId);
                var customer_info = {
                    phone: data.info.phone,
                    email: data.info.email,
                    name: data.info.fullName,
                    gender: data.gender.dataValue,
                    zen_req_id: zenUser.id
                }

                var customer_care_info = {
                    care_status: data.info.status,
                    sales_man: data.saleman.email,
                    take_note: data.info.note,
                    tags_keywords: data.info.utmKeyword,
                    appointment_time: data.calendar.startTime,
                    zen_req_id: zenUser.id
                }

                var digital_source_info = {
                    conversion: data.o2oTracking.statistics.goalNames,
                    source_medium: data.o2oTracking.statistics.utmSourceMediums,
                    campaign_name: data.o2oTracking.statistics.utmCampaigns,
                    keywords_terms: [...data.o2oTracking.statistics.utmKeywords, ...data.o2oTracking.statistics.utmTerms],
                    zen_req_id: zenUser.id
                }

                var web_access = {
                    first_web_access_time: data.o2oTracking.statistics.firstAccess,
                    last_web_access_time: data.o2oTracking.statistics.lastAccess,
                    zen_req_id: zenUser.id
                }

                return {
                    customer_info,
                    customer_care_info,
                    digital_source_info,
                    web_access
                }
            } catch (error) {
                return {err : true, msg : error};
            }
        }
    }

    async _getDetailHistoryWebAccess(page, pageSize) {
        try {
            const res = await axios.get(`${BASE_URL}/lead/weblog?leadId=${this.leadId}&page=${page}&pageSize=${pageSize}`, this.config);
            return res;
        } catch (err) {
            console.error(err);
        }
    }
    async _getLeadActivities(lastId = 0, filterType = ["all"]) {
        try {
            var body = {
                "from": lastId,
                "size": 10,
                "activityTypes": filterType
            }
            const res = await axios.post(`${BASE_URL}/lead/activity?leadId=${this.leadId}`, body, this.config);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

}

export default o2oApi

export function filterItem() {
    var existsFilterLocal = getLocalStorage('filterItem');
    if (existsFilterLocal)
        return existsFilterLocal;
    //init when open app
    var defaultFilterItem = [
        {
            text: 'All',
            value: 'all',
        },
        {
            text: 'Assignment',
            value: 'assignment',
        },
        {
            text: 'Status',
            value: 'status',
        },
        {
            text: 'Calendar status',
            value: 'statusCalendar',
        },
        {
            text: 'Create & Edit',
            value: 'edit',
        },
        {
            text: 'Create & Edit working calendar',
            value: 'editCalendar',
        },
        {
            text: 'Notes',
            value: 'note',
        },
        {
            text: 'Send message to Telegram',
            value: 'sendLead',
        },
        {
            text: 'Message from Telegram',
            value: 'recieveTelegram',
        },
        {
            text: 'Create calendar',
            value: 'sendCalendar',
        },
        {
            text: 'Feedback from Salesman',
            value: 'responseSale',
        }
    ];
    setLocalStorage('filterItem', defaultFilterItem);
    return defaultFilterItem;
}