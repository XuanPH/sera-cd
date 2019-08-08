import { addEventClickToElement, addEventShowHideHeader, setLocalStorage, isNullOrTempty } from '../javascripts/lib/helpers'
import { openCreateTicket } from './modal/popup'


export class CustomerInfo {
  constructor(params) {
    this.o2oApi = params.o2oApi;
    this._client = params._client;
    this.leads = {};
  }

  render(leads) {
    this.leads = leads;
    return `<div class="card customer-info">
        <h5 class="card-header">
          <i class="fas fa-chevron-up showHide pointer"></i>  Customer info
          <div class='header-righ'>
            <i class="fas fa-pen pointer"  id='openUpdateType'></i>
            <i class="fas fa-plus pointer"  id='dropdownMenuButton1' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <a data-ticket_subject='add customer info' id='openTypeCreate1' class="dropdown-item" href="#"> + Create ticket</a>
              </div>
          </div>
        </h5>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <div class="col-4">
                <img src="https://assets.zendesk.com/images/2016/default-avatar-80.png" alt="Avatar" class="avatar">
              </div>
              <div class="col-8">
                <span class="info-name">${leads.name}</span><br/>
                ${isNullOrTempty(leads.email, `<span style="color: cornflowerblue;">${leads.email}</span>`, '<span><i>(Email not avaialbe)</i></span>')}<br/>
                <span style="color: cornflowerblue;">
                  ${isNullOrTempty(leads.phone, (leads.phone + `&nbsp;&nbsp;<a href='tel:${leads.phone}'>
                    <i class="fas fa-phone-volume"></i></a>&nbsp;&nbsp;<a href='tel:${leads.phone}'>
                    <i class="fas fa-comment-dots" ></i></a>`), '')}
                  </span>
              </div >
            </div >
          </div >
        </div >
      </div > `
  }
  init(data) {
    let _client = this._client;
    addEventClickToElement('#openTypeCreate1', (e) => {
      var subject = $(e.target).data().ticket_subject || 'unknown subject';
      data.subject = subject;
      setLocalStorage('requester', data);
      _client.invoke('routeTo', 'ticket', 'new');
      // triggerOpenPopupCreate(e, true, _client)
    });
    addEventClickToElement('#openUpdateType', (e) => {
      openCreateTicket.bind(this).call();
    });
    addEventShowHideHeader('.customer-info', _client);
  }
}
