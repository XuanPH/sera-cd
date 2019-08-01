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
    }
    _getInteractionHistory() {
        return [
            {
                icon: "fab fa-facebook-square",
                title: "Liêm Nguyễn send message from Facebook",
                time: "20 minutes ago",
                perfix: "∙",
                note: "please send me quotation for Toyota..."
            },
            {
                icon: "fas fa-phone",
                title: "Missed call from Liêm Nguyễn",
                time: "Yester day",
                perfix: "",
                note: ""
            },
            {
                icon: "fas fa-shoe-prints",
                title: "Salesman changed status for Liêm Nguyễn",
                time: "Yester day",
                perfix: "∙",
                note: "From Prospect to Considering"
            },
            {
                icon: "fas fa-phone",
                title: "Called Liêm Nguyễn",
                time: "2 days ago",
                perfix: "∙",
                note: "30 sec <a href='#'>play now</a>"
            },
            {
                icon: "fas fa-phone",
                title: "Liêm Nguyễn Called",
                time: "5 days ago",
                perfix: "∙",
                note: "23 sec <a href='#'>play now</a>"
            },
            {
                icon: "fas fa-comment-dots",
                title: "Liêm Nguyễn comment on your post",
                time: "5 days ago",
                perfix: "∙",
                note: "Google service"
            },
            {
                icon: "fas fa-qrcode",
                title: "Liêm Nguyễn scanned Promotion Qrcode",
                time: "5 days ago",
                perfix: "",
                note: ""
            },
            {
                icon: "fas fa-wifi",
                title: "Liêm Nguyễn connected wifi",
                time: "5 days ago",
                perfix: "",
                note: ""
            },
            {
                icon: "fas fa-sms",
                title: "Send SMS To Liêm Nguyễn",
                time: "5 days ago",
                perfix: "∙",
                note: "Hi Mr.Liem, thanks for your..."
            }
        ]
    }

    async _getLeadFromPhoneOrEmail(phone, email) {
        try {
            const res = await axios.get(`${BASE_URL}/lead?phone=${phone}&email=${email}`, this.config);
            return res;
        } catch (err) {
            console.error(err);
        }
    }

    async _getLeadData(phone, email, id) {
        if (phone !== '' && email !== '') {
            try {
                const data = (await this.getLeadFromPhoneOrEmail(phone, email)).data.data;
                this.leadId = data.info.id;
                setLocalStorage('leadId', this.leadId);
                var customer_info = {
                    phone: data.info.phone,
                    email: data.info.email,
                    name: data.info.fullName,
                    gender: data.gender.dataValue,
                    zen_req_id: id
                }

                var customer_care_info = {
                    care_status: data.info.status,
                    sales_man: data.saleman.email,
                    take_note: data.info.note,
                    tags_keywords: data.info.utmKeyword,
                    appointment_time: data.calendar.startTime,
                    zen_req_id: id
                }

                var digital_source_info = {
                    conversion: data.o2oTracking.statistics.goalNames,
                    source_medium: data.o2oTracking.statistics.utmSourceMediums,
                    campaign_name: data.o2oTracking.statistics.utmCampaigns,
                    keywords_terms: [...data.o2oTracking.statistics.utmKeywords, ...data.o2oTracking.statistics.utmTerms],
                    zen_req_id: id
                }

                var web_access = {
                    first_web_access_time: data.o2oTracking.statistics.firstAccess,
                    last_web_access_time: data.o2oTracking.statistics.lastAccess,
                    zen_req_id: id
                }

                return {
                    customer_info,
                    customer_care_info,
                    digital_source_info,
                    web_access
                }
            } catch (error) {
                console.error(error);
                return null
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

}

export default o2oApi

export function filterItem() {
    var existsFilterLocal = getLocalStorage('filterItem');
    if (existsFilterLocal)
        return existsFilterLocal;
    //init when open app
    var defaultFilterItem = [
        {
            text: 'All interaction',
            value: 'all',
            checked: true
        },
        {
            text: 'Changes care status',
            value: 'change_care_status',
            checked: false
        },
        {
            text: 'Social interactions',
            value: 'social_interactions',
            checked: false
        },
        {
            text: 'Call logs',
            value: 'call_logs',
            checked: false
        },
        {
            text: 'SMS',
            value: 'sms',
            checked: false
        },
        {
            text: 'Offline touched point',
            value: 'offline_touched_point',
            checked: false
        }
    ];
    setLocalStorage('filterItem', defaultFilterItem);
    return defaultFilterItem;
}