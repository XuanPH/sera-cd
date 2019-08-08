import { addEventClickToElement, addEventShowHideHeader, templatingLoop, setLocalStorage, renderLoading, resizeContainer } from "../javascripts/lib/helpers";
import { triggerOpenPopupFilter } from "./modal/popup";
import I18n from '../javascripts/lib/i18n'

class InteractionHistory {
  constructor(params) {
    this.o2oApi = params.o2oApi;
    this._client = params._client;
    this.leads = {};
    this.activitiesData = [];
    this.lastId = 0;
    this.filterType = ["all"];
    this.defaultFilter = [
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
  }
  renderImagesButton(item, index) {
    return `<span'>Hình ${index}</span'>`
  }

  renderItem(item, index) {
    if (item.botId && item.refIds && item.refIds.length) {
      return `<li>
              <div class='icon-timeline'></div>
              ${item.refIds.length ? `<a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`sendSmsList.sentSuccess`)} ${item.item.refIds.length} ${I18n.t(`imageTelegram`)}</a>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
    }
    switch (item.type) {
      case 'assignment':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.allocateLead`)}</a>
              ${item.staffInCharge ? `<p>${I18n.t(`callLogs.leadAllocateFor`)} <a href="mailto: ${item.staffInCharge}">${item.staffInCharge}</a></p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'status':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.changeCalendar`)}</a>
              <p>${I18n.t(`callLogs.from`)} ${item.previousStatus ? `<b>${item.previousStatus}</b>` : `<b>${I18n.t(`callLogs.notStatus`)}</b>`}</p>
              <p>${I18n.t(`callLogs.to`)} ${item.currentStatusValue ? `<b>${item.currentStatusValue}</b>` : `<b>${I18n.t(`callLogs.notStatus`)}</b>`}</p>
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'statusCalendar':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.changeStatusLead`)}</a>
              <p>${I18n.t(`callLogs.from`)} ${item.previousStatus ? `<b>${item.previousStatus}</b>` : `<b>${I18n.t(`callLogs.notStatus`)}</b>`}</p>
              <p>${I18n.t(`callLogs.to`)} ${item.currentStatusValue ? `<b>${item.currentStatusValue}</b>` : `<b>${I18n.t(`callLogs.notStatus`)}</b>`}</p>
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'edit':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`history.${item.currentStatus}`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'editCalendar':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`history.${item.currentStatus}`)}</a>
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>              
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'note':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.updateNot`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'sendLead':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.sendTelegram`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'recieveTelegram':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.replyTelegram`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'sendCalendar':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`callLogs.setupCalendarToTelegram`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      case 'responseSale':
        return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`responseSale.${item.currentStatus}`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
      default: return `<li>
              <div class='icon-timeline'></div>
              <a style='padding-right: 5px;' target='_blank' href='javascript:void(0)' >${I18n.t(`responseSale.${item.currentStatus}`)}</a>
              ${item.note ? `<p>${item.note}</p>` : ''}
              <p><span class='time-gray'>${moment(item.createdAt).fromNow()} at ${moment(item.createdAt).format('hh:mm A DD MMMM YYYY')}</span></p>
              <i class="fas fa-plus pointer" id='dropdownMenuButtonw${index}'
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonw${index}">
                <a data-ticket_subject='${I18n.t(`callLogs.allocateLead`)}' class="dropdown-item add_ticket" href="#"> + Create ticket</a>
              </div>
            </li>`;
    }

  }

  render() {
    return `<div class="card interaction_history">
        <h5 class="card-header">
          <i class="fas fa-chevron-up showHide pointer"></i> Interaction history
            <div class='header-righ'>
              <div class='dropleft'>
              <i class="fas fa-filter pointer" data-toggle="dropdown"></i>
              <ul class="dropdown-menu ">
                ${templatingLoop(this.defaultFilter, (item, index) => {
                  return `
                        <li>
                          <a href="#" class="small" data-value="${item.value}" tabIndex="-1">
                              <div class="custom-control custom-checkbox">
                                  <input type="checkbox" class="custom-control-input" id="customCheck${index}">
                                  <label class="custom-control-label" for="customCheck${index}">&nbsp;${item.text}</label>
                                  <i class="fas fa-check"></i>
                              </div>
                          </a>
                      </li>
                    `
                  })}
                  <li>
                    <button id='cancelFilter' type="button" class="btn btn-secondary btn-sm">Cancel</button>
                    <button id='applyFilter' type="button" class="btn btn-primary btn-sm">Apply</button>
                  </li>
              </ul>
              </div>
             
          </div>
        </h5>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <ul class="timeline"> 
                ${renderLoading()}
              </ul>
              <div class='col-2'>
              </div>
              <div class='col-10'>
                <a href='javascript:void(0)' id='interactionLoadMore' >Load more <i class="fas fa-long-arrow-alt-right"></i></a>
              </div>
            </div>
          </div>
        </div>
          </div> `
  }

  renderList() {
    
    let dataUser = this.leads;
    let _client = this._client;

    $("ul.timeline").html('');
    $('ul.timeline').html(templatingLoop(this.activitiesData, this.renderItem));

    addEventClickToElement('ul.timeline .add_ticket', (e) => {
      var subject = $(e.target).data().ticket_subject || 'unknown subject';
      dataUser.subject = subject;
      setLocalStorage('requester', dataUser);
      _client.invoke('routeTo', 'ticket', 'new');
    });
    resizeContainer(this._client, Number.POSITIVE_INFINITY, true);
  }

  async read(isOverride) {
    renderLoading(true, 'ul.timeline');
    let response = (await this.o2oApi.getLeadActivities(this.lastId, this.filterType)).data;
    this.lastId = this.lastId += response.size;
    if (response && response.data && response.data.length > 0) {
      if (isOverride !== true) {
        this.activitiesData = _.union(this.activitiesData, response.data);
      }else {
        this.activitiesData = response.data;
      }
    }
    if (this.lastId >= response.total) {
      $("#interactionLoadMore").remove();
    }
    this.renderList();
  }
  init(leads) {

    let _client = this._client;
    this.leads = leads;

    addEventClickToElement('#openTypeFilter', (e) => { triggerOpenPopupFilter(e, true, _client) });

    addEventClickToElement('#interactionLoadMore', (e) => {this.read();})

    addEventShowHideHeader('.interaction_history', _client);

    var options = [];
    $('.dropdown-menu li').on('click', function (event) {
      var $target = $(event.currentTarget),
        val = $target.find('a').attr('data-value'),
        $inp = $target.find('input'),
        idx;
      if ((idx = options.indexOf(val)) > -1) {
        options.splice(idx, 1);
        $target.removeClass('active-filter');
        setTimeout(function () { $inp.prop('checked', false) }, 0);
      } else {
        if (val)
          options.push(val);
        $target.addClass('active-filter');
        setTimeout(function () { $inp.prop('checked', true) }, 0);
      }
      $(event.target).blur();
      return false;
    });
    // first always triiger all
    $(`a[data-value=all]`).closest('li').trigger('click');


    $("#applyFilter").on('click', (e) => {
      if (options && options.length > 0){
        this.filterType = _.filter(options, (o) => { return o && o !== null });
        this.lastId = 0;
        this.read(true);
        $("button#applyFilter").closest('ul').removeClass('show')
      }
    }); 

    $("#cancelFilter").on('click', async (e) => {
      await $("li.active-filter").trigger('click');
      this.filterType.forEach((item, index) =>{
        let elemtn =  $(`a[data-value=${item}]`).closest('li');
        if (!elemtn.hasClass('active-filter'))
          elemtn.trigger('click');
      });
      options = this.filterType;
      $("button#applyFilter").closest('ul').removeClass('show')
    });
  }
}

export default InteractionHistory