import I18n from '../../javascripts/lib/i18n'
import { resizeContainer, render, setLocalStorage } from '../../javascripts/lib/helpers'
import { renderCustomerInfo, openModalType, initCustomerInfoFunction, CustomerInfo } from '../../templates/customer_info';
import { renderWebAccessed, initWebAccessedFunction } from '../../templates/web_accessed';
import { renderCustomerCareInfo, initCustomerCreateInfoFunction } from '../../templates/customer_care_info'
import { renderDSI, initDSIFunction } from '../../templates/digital_source_info'
import { renderPopupCreateType, renderPopupFilter, initPopupFilterFunction, initPopupCreateFunction } from '../../templates/modal/popup'
import { renderNotFound, initNotFoundFunction } from '../../templates/not_found';
import { ticketSiderbar, newTicketSiderbar } from './background_handle';
import o2oApi from '../../api/o2oApi'
import InteractionHistory from '../../templates/interation-history'

const MAX_HEIGHT = 5000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

class App {
  constructor(client, appData, location) {
    this._client = client
    this._appData = appData
    this.o2oToken = appData.metadata.settings["O2O-Token"]
    this.states = {
      location: location
    }
    this.o2oApi = new o2oApi(this.o2oToken);
    setLocalStorage('token', this.o2oToken);
    this.initializePromise = this.init()
    this.initWebAccessedFunction = initWebAccessedFunction.bind(this);
    this.handleDataUserTicket = this._handleDataUserTicket.bind(this);
    this.ticketSiderbar = ticketSiderbar.bind(this);
    this.newTicketSiderbar = newTicketSiderbar.bind(this);
    this.handleError = this._handleError.bind(this);


    this.interactionHistory = new InteractionHistory(this);
    this.customerInfo = new CustomerInfo(this);

  }
  /**
   * Initialize module, render main template
   */
  async init() {
    const currentUser = (await this._client.get('currentUser')).currentUser
    this.states.currentUserName = currentUser.name
    I18n.loadTranslations(currentUser.locale);

    const organizations = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this.handleError.bind(this))

    // background function  
    this.ticketSiderbar();
    this.newTicketSiderbar();
    //

    const dataUser = this.getEmailAndPhoneFromZendeskUser(await this.handleDataUserTicket());
    const isMaintain = false;
    const leads = await this.o2oApi.getLeadData(dataUser, organizations);

    // const assignedInfo = (await this._client.get('user'))
    if (leads && !leads.err && this.o2oToken && !isMaintain) {
      render('loader', this.customerInfo.render(leads.customer_info), () => {
        // document.getElementById('openTypeCreate1').addEventListener('click', openModalType.bind(this));
        this.customerInfo.init(leads.customer_info);
      });

      render('customer_care_info', renderCustomerCareInfo(leads.customer_care_info), () => {
        initCustomerCreateInfoFunction(this._client, leads.customer_care_info);
      });

      render('digital_source_info', renderDSI(leads.digital_source_info), () => {
        initDSIFunction(this._client);
      });

      render('web_access', renderWebAccessed(leads.web_access), () => {
        this.initWebAccessedFunction(this._client, leads.web_access);
      });

      render('interaction_history', this.interactionHistory.render(), () => {
        this.interactionHistory.init(leads.customer_info)
        this.interactionHistory.read();
      });

      render('popup_create .popup_content', renderPopupCreateType(), () => {
        initPopupCreateFunction(this._client);
      });

      render('popup_filter .popup_content', renderPopupFilter(), () => {
        initPopupFilterFunction(this._client);
      });

      return resizeContainer(this._client, MAX_HEIGHT, true)

    } else {
      if (leads)
        render('loader', renderNotFound(leads.msg), () => {
          initNotFoundFunction();
        });
    }
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError(error) {
    console.log('An error is handled here: ', error.message)
  }

  async _handleDataUserTicket() {
    switch (this.states.location) {
      case 'ticket_sidebar': return (await this._client.get('ticket')).ticket.requester; break; //ticket location
      case 'user_sidebar': return (await this._client.get('user')).user; break; //ticket location
    }
  }
  getEmailAndPhoneFromZendeskUser(dataUser) {
    if (!dataUser) {
      return {
        phone: '',
        email: ''
      }
    }
    var phone = _.filter(dataUser.identities, (o) => { return o.type == 'phone_number' })[0]
    var email = _.filter(dataUser.identities, (o) => { return o.type == 'email' })[0]
    return {
      phone: phone ? phone.value : '',
      email: email ? email.value : '',
      id: dataUser.id,
      name: dataUser.name,
    }
  }

}

export default App
