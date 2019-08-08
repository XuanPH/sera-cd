import {
  addEventClickToElement,
  addEventShowHideHeader,
  setLocalStorage,
  replaceNullOrTempty,
  renderLoading
} from '../javascripts/lib/helpers'
import {
  openUpdateCusomer
} from './modal/popup'


export class CustomerInfo {
  constructor(params) {
    this.o2oApi = params.o2oApi;
    this._client = params._client;
    this.leads = {};
    this.dataUser = {};
  }

  render(leads) {
    ;
    this.leads = leads;
    return `<div class="card customer_info">
        <h5 class="card-header">
          <i class="fas fa-chevron-up showHide pointer"></i>  Customer info
          <div class='header-righ'>
            <div>
              <i class="fas fa-plus pointer"  id='dropdownMenuButton1' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <a data-ticket_subject='add customer info' id='openTypeCreate1' class="dropdown-item" href="#"> + Create ticket</a>
              </div>
            </div>

            <div>
              <i class="fas fa-pen pointer"  id='openUpdateType'></i>
            </div>

            <div>
              <i class="fas fa-sync pointer"  id='dropdownSync' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownSync">
                  <a class="dropdown-item syncData" data-type='from' href="#"> + Sync from O2O</a>
                  <a class="dropdown-item syncData" data-type='to' href="#"> + Sync to O2O</a>
              </div>
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
                ${replaceNullOrTempty(leads.email, `<span style="color: cornflowerblue;">${leads.email}</span>`, '<span><i>(Email not avaialbe)</i></span>')}<br/>
                <span style="color: cornflowerblue;">
                  ${replaceNullOrTempty(leads.phone, (leads.phone + `&nbsp;&nbsp;<a href='tel:${leads.phone}'>
                    <i class="fas fa-phone-volume"></i></a>&nbsp;&nbsp;<a href='tel:${leads.phone}'>
                    <i class="fas fa-comment-dots" ></i></a>`), '')}
                  </span>
              </div >
            </div >
            <hr/>
            <div class="row">
                <div class="col-1">
                    <i class="far fa-heart"></i>
                </div>
                <div class="col-10">
                    Care status <b>${leads.care_status}</b>
                </div>
                <div class="col-1">
                    <i class="fas fa-user"></i>
                </div>
                <div class="col-10 accessed-last">
                    Salesman: <b>${leads.sales_man ? leads.sales_man : ''}</b>
                </div>
                <div class="col-1">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="col-10 accessed-last">
                    Have appointment at <b>${moment(leads.appointment_time).format('hh:mm A DD MMMM YYYY')}</b>
                </div>
                  <div class="col-1">
                    <i class="far fa-clipboard"></i>
                </div>
                <div class="col-10 accessed-last">
                    Take note: ${leads.take_note ? leads.take_note : ''}
                </div>
                <div class="col-1">
                </div>
                <div class="col-10 accessed-last">
                  ${leads.tags_keywords ? templatingLoop(leads.tags_keywords, (data) => { return `<div class="c-tag"><span dir="ltr">${data}</span></div>` }) : ''}
                </div>
              </div >
          </div>
        </div>
      </div> `
  }

  renderConfirmSync(type) {
    let _title = type === 'to' ? 'Confirm synchronization from Zendesk to O2O ?' : 'Confirm synchronization from O2O to Zendesk ?'
    return `
          <div class='row' style='margin: 0;'>
              <div class='col-12' style='text-align: center;'>
                <h1>${_title}</h1>
              </div>  
              <div class='col-12' style='text-align: center;    margin-top: 30px;'>
              
              </div>
              <div class='col-6'>
              <button id='closeModal' style='font-size: 1rem !important;width: 100%;' type="button" class="btn btn-secondary btn-lg">Cancel</button>
            </div>
            <div class='col-6'>
              <button id='saveData' style='font-size: 1rem !important;width: 100%;' type="button" class="btn btn-primary btn-lg">Save</button>
            </div>
          </div>
      `
  }
  init(data) {
    let _client = this._client;
    let o2oApi = this.o2oApi;
    let dataUser = this.dataUser;

    addEventClickToElement('#openTypeCreate1', (e) => {
      var subject = $(e.target).data().ticket_subject || 'unknown subject';
      data.subject = subject;
      setLocalStorage('requester', data);
      _client.invoke('routeTo', 'ticket', 'new');
      // triggerOpenPopupCreate(e, true, _client)
    });
    addEventClickToElement('#openUpdateType', (e) => {
      this.dataUser = data;
      openUpdateCusomer.bind(this).call();
    });
    addEventShowHideHeader('.customer_info', _client);

    addEventClickToElement('.syncData', (e) => {
      var type = $(e.target).data().type;
      let _this = this;
      let _client = this._client;
      return _client.invoke('instances.create', {
        location: 'modal',
        url: 'assets/iframe.html',
        size: {
          width: '470px',
          height: '200px'
        }
      }).then(function (modalContext) {
        var instanceGuid = modalContext['instances.create'][0].instanceGuid;
        var modalClient = _client.instance(instanceGuid);
        var passParams = {
          type: 'confirm_sync',
          parentGuid: _client._instanceGuid,
          o2oApi: o2oApi,
          dataUser: dataUser,
          content: _this.renderConfirmSync(type)
        };
        setTimeout(() => {
          modalClient.trigger('template_getting_type', passParams);
        }, 1000);
      });
    })
    // listen event trigger from modal
    _client.on('data_modal_passing', (modalData) => {
      console.log('data_modal_passing event called...');
      if (modalData) {
        renderLoading(true, '.main', _client);
        window.location.reload(true)
      }
    });
  }
}

export function _initModal() {
  let client = this._client;
  let parentClient = this._parentClient;
  addEventClickToElement('#closeModal', (e) => {
    client.invoke('destroy');
  });
  addEventClickToElement('#saveData', (e) => {
    parentClient.trigger('data_modal_passing', true);
    client.invoke('destroy');
  });
}