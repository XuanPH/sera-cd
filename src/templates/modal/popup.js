import {
  addEventClickToElement,
  resizeContainer,
  templatingLoop,
  render,
  setLocalStorage,
  getLocalStorage
} from '../../javascripts/lib/helpers';
import {
  filterItem
} from '../../api/o2oApi'
// render function

export function renderItemFilter(item) {
  return ` <div class="row pointer item" data-filter_type='${item.value}'>
                <div class="col-10"> ${item.text}</div>
                <div class="col-1">${item.checked ? `<i class="fas fa-check">` : ''}</i></div>
              </div>
              <hr/>`
}

export function renderPopupCreateType() {
  return `<div class="card">
            <h5 class="card-header">
              Option
              <div class='header-righ'>
                <i class="fas fa-times pointer"></i>
              </div>
            </h5>
            <div class="card-body">
              <div class="row pointer item">
                <div class="col-12"> + Create a ticket</div>
              </div>
              <hr/>
              <div class="row pointer item">
                <div class="col-12"> + Add to interactions</div>
              </div>
            </div >
          </div > `
}

export function renderPopupFilter() {
  var filters = filterItem();
  return `<div class="card">
            <h5 class="card-header">
              Filter
              <div class='header-righ'>
                <i class="fas fa-times pointer"></i>
              </div>
            </h5>
            <div class="card-body">
              ${templatingLoop(filters, renderItemFilter)}
              <div class="row pointer">
                <div class="col-6">
                  <button type="button" class="btn btn-secondary btn-md" id='cancel'>Cancel</button>
                </div>
                 <div class="col-6">
                  <button type="button" class="btn btn-primary btn-md" id='apply'>Apply</button>
                </div>
              </div>
            </div >
          </div > `
}

// trigger function
export function triggerOpenPopupCreate(obj, isShow, _client, defaultOffsetPlus = 30, defaultClosest = 'div.card') {
  var target = $(obj.target);
  var offsetTopEl = target.closest(defaultClosest)[0].offsetTop;
  if (isShow) {
    document.getElementsByClassName('popup_create')[0].style.display = "block"
    $(".popup_create .card").offset({
      top: offsetTopEl + defaultOffsetPlus
    });
  } else {
    document.getElementsByClassName('popup_create')[0].style.display = "none"
  }
  let elHeight = (offsetTopEl + target.closest('div.card').width());
  resizeContainer(_client, elHeight, !isShow);
}

export function triggerOpenPopupFilter(obj, isShow, _client, offsetPSubstract = 40) {
  var offsetTopEl = $(obj.target).closest('div.card')[0].offsetTop;
  if (isShow) {
    document.getElementsByClassName('popup_filter')[0].style.display = "block"
    $(".popup_filter .card").offset({
      top: offsetTopEl - offsetPSubstract
    });
    setLocalStorage('filter_top', offsetTopEl - offsetPSubstract);
  } else {
    document.getElementsByClassName('popup_filter')[0].style.display = "none"
  }
  let elHeight = (offsetTopEl + $(obj.target).closest('div.card').width());
  resizeContainer(_client, elHeight, !isShow);
}


// init function hackk 
export function initPopupFilterFunction(_client) {
  addEventClickToElement('.popup_filter .fa-times,#cancel', (e) => {
    triggerOpenPopupFilter(e, false, _client)
  });
  addEventClickToElement('.popup_filter .item', (e) => {
    var filter_type = $(e.target).closest('.item').data().filter_type;
    var currentFilterAction = filterItem();
    currentFilterAction.map((item, index) => {
      if (item.value === filter_type)
        item.checked = !item.checked;
      return item;
    });
    setLocalStorage('filterItem', currentFilterAction);
    render('popup_filter div.card', renderPopupFilter(), (e) => {
      initPopupFilterFunction(_client);
      $(e).offset({
        top: parseInt(getLocalStorage('filter_top', true) || 0)
      });
    });
  });
}

export function initPopupCreateFunction(_client) {
  addEventClickToElement('.popup_create .fa-times', (e) => {
    triggerOpenPopupCreate(e, false, _client);
  });
  addEventClickToElement('.popup_create .item:first-child', openUpdateCusomer.bind(_client))
}

export function openUpdateCusomer() {
  let _client = this._client;
  let o2oApi = this.o2oApi;
  let dataUser = this.dataUser;
  return _client.invoke('instances.create', {
    location: 'modal',
    url: 'assets/iframe.html',
    size: {
      width: '450px',
      height: '550px'
    }
  }).then(function (modalContext) {
    var instanceGuid = modalContext['instances.create'][0].instanceGuid;
    var modalClient = _client.instance(instanceGuid);
    setTimeout(() => {
      document.querySelector('.popup_create .fa-times').click();
      var passParams = {
        type: 'customer_update',
        parentGuid: _client._instanceGuid,
        o2oApi: o2oApi,
        dataUser: dataUser
      };
      modalClient.trigger('template_getting_type', passParams);
    }, 500);
  });
}