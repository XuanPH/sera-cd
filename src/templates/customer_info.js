import {
  addEventClickToElement,
  addEventShowHideHeader,
  setLocalStorage,
  replaceNullOrTempty,
  renderLoading,
  isNullOrTempty
} from "../javascripts/lib/helpers";
import { openUpdateCusomer } from "./modal/popup";
import { update } from "tcomb";

export class CustomerInfo {
  constructor(params) {
    this.o2oApi = params.o2oApi;
    this._client = params._client;
    this.leads = {};
    this.dataUser = {};
  }

  render(leads) {
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
              <i class="fas fa-pen pointer" id='dropdownEdit' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownEdit">
              <a class="dropdown-item"  id='openUpdateType'  data-type='from' href="#"> + Care infomation</a>
              <a class="dropdown-item" id='openUpdateInterest' data-type='to' href="#"> + Interest infomation</a>
            </div>
            </div>

            <div>
              <i class="fas fa-sync pointer"  id='dropdownSync' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div class="dropdown-menu" aria-labelledby="dropdownSync">
                  <a style='display:none' class="dropdown-item syncData" data-type='from' href="#"> + O2O <i style='margin-left: 0' class="fas fa-long-arrow-alt-right"></i> Zendesk</a>
                  <a class="dropdown-item syncData" data-type='to' href="#"> + Zendesk <i style='margin-left: 0'  class="fas fa-long-arrow-alt-right"></i> O2O</a>
              </div>
            </div>
          </div>
        </h5>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <div class="col-4">
                <img src="https://ui-avatars.com/api/?name=${
                  leads.name
                }&rounded=true&size=64&color=ff0000&bold=true alt="Avatar" class="avatar">
              </div>
              <div class="col-8">
                <span class="info-name">${leads.name}</span><br/>
                ${replaceNullOrTempty(
                  leads.email,
                  `<span style="color: cornflowerblue;">${leads.email}</span>`,
                  "<span><i>(Email not avaialbe)</i></span>"
                )}<br/>
                <span style="color: cornflowerblue;">
                  ${replaceNullOrTempty(
                    leads.phone,
                    leads.phone +
                      `&nbsp;&nbsp;<a href='tel:${leads.phone}'>
                    <i class="fas fa-phone-volume"></i></a>&nbsp;&nbsp;<a href='tel:${leads.phone}'>
                    <i class="fas fa-comment-dots" ></i></a>`,
                    ""
                  )}
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
                    <i class="fas fa-user" title="Salesman"></i>
                </div>
                <div class="col-10 accessed-last">
                    ${replaceNullOrTempty(
                      leads.sales_man,
                      `<b>${leads.sales_man_first_name} | ${leads.sales_man}</b>`,
                      `<span><i>(Not available data)</i><span>`
                    )}
                </div>
                <div class="col-1">
                    <i class="fas fa-calendar-alt" data-toggle="tooltip" title="Have appointment at"></i>
                </div>
                <div class="col-10 accessed-last" data-a='${
                  leads.appointment_time
                }'>
                     ${replaceNullOrTempty(
                       leads.appointment_time,
                       `<b>${moment(leads.appointment_time).format(
                         "hh:mm A DD MMMM YYYY"
                       )}</b>`,
                       `<span><i>(Not available data)</i><span>`
                     )} 
                </div>
                  <div class="col-1">
                    <i class="far fa-clipboard" title="Take note" ></i>
                </div>
                <div class="col-10 accessed-last">
                    ${replaceNullOrTempty(
                      leads.take_note,
                      leads.take_note,
                      `<span><i>(Not available data)</i><span>`
                    )}
                </div>
                <div class="col-1">
                </div>
                <div class="col-10 accessed-last">
                  ${
                    leads.tags_keywords
                      ? templatingLoop(leads.tags_keywords, data => {
                          return `<div class="c-tag"><span dir="ltr">${data}</span></div>`;
                        })
                      : ""
                  }
                </div>
              </div >
          </div>
        </div>
      </div> `;
  }

  renderConfirmSync(type) {
    let _title =
      type === "to"
        ? "Confirm synchronization from Zendesk to O2O ?"
        : "Confirm synchronization from O2O to Zendesk ?";
    return `
          <div class='row confirm_sync' style='margin: 0;'>
              <div class='col-12' style='text-align: center;'>
                <h1>${_title}</h1>
              </div>  
              <div class='col-12' style='text-align: center;margin-top: 30px;'>
              </div>
              <div class='col-6'>
              <button id='closeModal' style='font-size: 1rem !important;width: 100%;' type="button" class="btn btn-secondary btn-lg">Cancel</button>
            </div>
            <div class='col-6'>
              <button id='saveData' style='font-size: 1rem !important;width: 100%;' type="button" class="btn btn-primary btn-lg">Save</button>
            </div>
          </div>
      `;
  }

  init(data) {
    let _client = this._client;
    let o2oApi = this.o2oApi;
    this.dataUser = data;
    addEventClickToElement("#openTypeCreate1", e => {
      var subject = $(e.target).data().ticket_subject || "unknown subject";
      data.subject = subject;
      setLocalStorage("requester", data);
      _client.invoke("routeTo", "ticket", "new");
      // triggerOpenPopupCreate(e, true, _client)
    });
    addEventClickToElement("#openUpdateType", e => {
      let _client = this._client;
      _client._instanceClients = {};
      let o2oApi = this.o2oApi;
      let dataUser = this.dataUser;
      return _client
        .invoke("instances.create", {
          location: "modal",
          url: "assets/iframe.html",
          size: {
            width: "450px",
            height: "550px"
          }
        })
        .then(function(modalContext) {
          var instanceGuid = modalContext["instances.create"][0].instanceGuid;
          var modalClient = _client.instance(instanceGuid);
          setTimeout(() => {
            document.querySelector(".popup_create .fa-times").click();
            var passParams = {
              type: "customer_update",
              parentGuid: _client._instanceGuid,
              o2oApi: o2oApi,
              dataUser: dataUser
            };
            setLocalStorage("trigger_modal_data", passParams);
            //modalClient.trigger("template_getting_type", passParams);
          }, 500);
        });
    });

    addEventShowHideHeader(".customer_info", _client);

    addEventClickToElement(".syncData", async e => {
      var type = $(e.target).data().type;
      let _this = this;
      let _client = this._client;
      _client._instanceClients = {};
      let dataUser = this.dataUser;
      //let data = await this.o2oApi.updateZendeskUser(_client);
      return _client
        .invoke("instances.create", {
          location: "modal",
          url: "assets/iframe.html",
          size: {
            width: "470px",
            height: "200px"
          }
        })
        .then(function(modalContext) {
          var instanceGuid = modalContext["instances.create"][0].instanceGuid;
          var modalClient = _client.instance(instanceGuid);
          var passParams = {
            type: "confirm_sync",
            parentGuid: _client._instanceGuid,
            o2oApi: o2oApi,
            dataUser: dataUser,
            content: _this.renderConfirmSync(type)
          };
          setLocalStorage("trigger_modal_data", passParams);
          // setTimeout(() => {
          //   modalClient.trigger("template_getting_type", passParams);
          // }, 1000);
        });
    });
    //event interecst show modal
    addEventClickToElement("#openUpdateInterest", e => {
      let _this = this;
      var type = $(e.target).data().type;
      let dataUser = _this.dataUser;
      let _client = _this._client;
      _client._instanceClients = {};
      return _client
        .invoke("instances.create", {
          location: "modal",
          url: "assets/iframe.html",
          size: {
            width: "800px",
            height: "600px"
          }
        })
        .then(function(modalContext) {
          var instanceGuid = modalContext["instances.create"][0].instanceGuid;
          var modalClient = _client.instance(instanceGuid);

          var passParams = {
            type: "interest_update",
            parentGuid: _client._instanceGuid,
            o2oApi: o2oApi,
            dataUser: dataUser
          };
          setLocalStorage("trigger_modal_data", passParams);
          // setTimeout(() => {
          //   modalClient.trigger("template_getting_type", passParams);
          // }, 1000);
        });
    });

    // listen event trigger from modal
    _client.on("data_modal_passing", modalData => {
      if (modalData.toastr) {
        modalData.toastrType
          ? toastr.success(modalData.message)
          : toastr.error(modalData.message);
      }
      if (modalData.reload) {
        setTimeout(() => {
          //renderLoading(true, ".main", _client);
          window.location.reload(true);
        }, 1000);
      }
    });
  }
}

export function _initModal() {
  let client = this._client;
  let parentClient = this._parentClient;
  let o2oApi = this.o2oApi;
  addEventClickToElement("#closeModal", e => {
    client.invoke("destroy");
  });
  addEventClickToElement("#saveData", async e => {
    renderLoading(true, ".confirm_sync");
    var postData = this.dataUser;
    var currentUser = {};
    try {
      currentUser = (await parentClient.get("ticket.requester"))[
        "ticket.requester"
      ];
    } catch (err) {
      currentUser = (await parentClient.get("user"))["user"];
    }
    var phone = _.filter(currentUser.identities, o => {
      return o.type == "phone_number";
    })[0];
    currentUser.phone = phone ? phone.value : "";
    postData.fullName = currentUser.name;
    postData.staffInCharge = postData.sales_man_id;
    postData.status = postData.care_status_id;
    postData.note = postData.take_note;
    !isNullOrTempty(currentUser.phone) && (postData.phone = currentUser.phone);
    !isNullOrTempty(currentUser.email) && (postData.email = postData.email);
    var updateLead = (await o2oApi.updateLead(postData)).data.isSuccess;
    var passParams = {
      reload: true,
      toastr: true,
      toastrType: true,
      message: "Updated success"
    };
    if (!updateLead) {
      var passParams = {
        reload: false,
        toastr: true,
        toastrType: false,
        message: "'Update failed! Try again'"
      };
    }
    setTimeout(() => {
      parentClient.trigger("data_modal_passing", passParams);
      client.invoke("destroy");
    }, 1000);
  });
}
