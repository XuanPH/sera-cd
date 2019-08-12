import {
    render,
    renderSelect2,
} from '../../javascripts/lib/helpers'
import WebAccessDetailModel from '../../templates/modal/web_access_detail'
import CustomerUpdate from '../../templates/modal/customer_update'
import WebAccessChart from '../../templates/modal/web_access_chart'
import InterestUpdate from '../../templates/modal/interest_update'
import {
    _initModal
} from '../../templates/customer_info'
import 'select2'
import o2oApi from '../../api/o2oApi';
class Modal {
    constructor(client, appData) {
        this.state = {};
        this.typeModal = "typeModal";
        this.handleModal = this._handleModal.bind(this);
        this.initModal = _initModal.bind(this);
        this._client = client;
        this._appData = appData;
        this._content = "";
        client.on('template_getting_type', (template_getting_type) => {
            this.dataUser = template_getting_type.dataUser ? template_getting_type.dataUser : {}
            this._content = template_getting_type.content ? template_getting_type.content : '';
            this._parentClient = client.instance(template_getting_type.parentGuid);
            this.o2oApi = new o2oApi(template_getting_type.o2oApi.token, template_getting_type.o2oApi.leadId);
            this.webAccessedModal = new WebAccessDetailModel(this.o2oApi);
            this.webAccessChart = new WebAccessChart(template_getting_type.type_chart);
            this.customerUpdate = new CustomerUpdate(this._client, this.dataUser, this.o2oApi, this._parentClient);
            this.interestUpdate = new InterestUpdate(this._client, this.dataUser, this.o2oApi, this._parentClient);
            this.initializePromise = this.init(template_getting_type.type);
        });
        setTimeout(() => {
            if (!this.o2oApi) {
                this._content = "We cant bind this form to zendesk, please refresh that page"
                this.initializePromise = this.init("error");
            }
        }, 10000);
    }

    async init(type) {
        // let ticketInfo = (await this._parentClient.get('ticket'));
        render('loader', await this.handleModal(type), () => {
            if (type === 'customer_update') {
                this.customerUpdate.init();
            }
            if (type === 'web_access_log') {
                renderSelect2('#itemperpages');
                this.webAccessedModal.init();
                this.webAccessedModal.read();
            }
            if (type === 'web_access_chart') {
                this.webAccessChart.init();
            }
            if (type === 'confirm_sync') {
                this.initModal();
            }
            if (type === 'interest_update') {
                this.interestUpdate.init();
            }
        });
    }
    async _handleModal(type) {
        switch (type) {
            case 'web_access_log':
                return await this.webAccessedModal.render();
            case 'web_access_chart':
                return await this.webAccessChart.render();
            case 'customer_update':
                return await this.customerUpdate.render();
            case 'interest_update':
                return await this.interestUpdate.render();
            default:
                return this._content;
        }
    }
    templateAssign(state) {
        var $state = $(
            '<span><i class="fas fa-user"></i>    ' + state.text + '</span>'
        );
        return $state;
    }
}

export default Modal