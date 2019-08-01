
import { render, renderSelect2 } from '../../javascripts/lib/helpers'
import WebAccessDetailModel from '../../templates/modal/web_access_detail'
import { ticketCreateModal, initCreateTicketFunction } from '../../templates/modal/ticket_create'
import WebAccessChart from '../../templates/modal/web_access_chart'
import 'select2'
import o2oApi from '../../api/o2oApi';
class Modal {
    constructor(client, appData) {
        this.state = {};
        this.typeModal = "typeModal";
        this.handleModal = this.handleModal.bind(this);
        this._client = client;
        this._appData = appData;
        client.on('template_getting_type', (template_getting_type) => {
            this._parentClient = client.instance(template_getting_type.parentGuid);
            this.initializePromise = this.init(template_getting_type.type);
            this.o2oApi = new o2oApi(template_getting_type.o2oApi.token, template_getting_type.o2oApi.leadId);
            this.webAccessedModal = new WebAccessDetailModel(this.o2oApi);
            this.webAccessChart = new WebAccessChart(template_getting_type.type_chart);
        });
    }

    async init(type) {
        let ticketInfo = (await this._parentClient.get('ticket'));
        render('loader', await this.handleModal(type, ticketInfo), () => {
            if (type === 'create_ticket') {
                renderSelect2('#assignee', { templateResult: this.templateAssign });
                renderSelect2('#type, #piority');
                renderSelect2('#tags', { tags: true });
                initCreateTicketFunction(this._client);
            }
            if (type === 'web_access_log') {
                renderSelect2('#itemperpages');
                this.webAccessedModal.init();
                this.webAccessedModal.read();
            }
            if (type === 'web_access_chart') {
                this.webAccessChart.init();
            }
        });
    }
    async handleModal(type, data) {
        switch (type) {
            case 'web_access_log': return await this.webAccessedModal.render();
            case 'web_access_chart': return await this.webAccessChart.render();
            case 'create_ticket': return ticketCreateModal(data, this);
            // case 'filter_modal': return null; break;
            default: return await this.webAccessedModal.render();
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