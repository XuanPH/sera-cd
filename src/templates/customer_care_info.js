import { addEventClickToElement, addEventShowHideHeader, setLocalStorage, templatingLoop } from '../javascripts/lib/helpers';

export function renderCustomerCareInfo(leads) {
  return `<div class="card customer_care_info">
            <h5 class="card-header">
              <i class="fas fa-chevron-up showHide pointer"></i> Customer care info
              <div class='header-righ'>
                <i class="fas fa-pen pointer"></i>
                 <i class="fas fa-plus pointer"  id='dropdownMenuButton2' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                    <a  data-ticket_subject='add customer care info' id='openTypeCreate2' class="dropdown-item" href="#"> + Create ticket</a>
                  </div>
              </div>
            </h5>
            <div class="card-body">
              <div class="container">
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
                     Salesman: <b>${leads.sales_man}</b>
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
                     Take note: ${leads.take_note}
                  </div>
                  <div class="col-1">
                  </div>
                  <div class="col-10 accessed-last">
                    ${leads.tags_keywords ? templatingLoop(leads.tags_keywords, (data) => { return `<div class="c-tag"><span dir="ltr">${data}</span></div>` }) : ''}
                  </div>
                </div >
              </div >
            </div >
          </div > `
}

export function openModal() {
  let self = this;
  return self._client.invoke('instances.create', {
    location: 'modal',
    url: 'assets/iframe.html',
    size: {
      width: '800px',
      height: '300px'
    }
  }).then(function (modalContext) {
    var instanceGuid = modalContext['instances.create'][0].instanceGuid;
    self._client.instance(instanceGuid);
  });
}

export function initCustomerCreateInfoFunction(_client, data) {
  addEventClickToElement('#openTypeCreate2', (e) => {
    var subject = $(e.target).data().ticket_subject || 'unknown subject';
    data.subject = subject;
    setLocalStorage('requester', data);
    _client.invoke('routeTo', 'ticket', 'new')
    //triggerOpenPopupCreate(e, true, _client);
  });
  addEventShowHideHeader('.customer_care_info', _client);
}