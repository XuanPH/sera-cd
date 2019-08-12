import {
    addEventClickToElement,
    renderSelect2,
    templatingLoop,
    isNullOrTempty,
    isValidEmail,
    renderLoadingWithPanel,
    replaceNullOrTempty
} from '../../javascripts/lib/helpers';

class CustomerUpdate {
    constructor(_client, dataUser, o2oApi, _parentClient) {
        this._client = _client;
        this._parentClient = _parentClient;
        this.dataUser = dataUser;
        this.o2oApi = o2oApi;
    }
    async render() {
        var requester = this.dataUser;
        var commonData = (await this.getCommonData());
        console.log(requester);
        return `
            <div class='customer_update'>
                <div class="row">
                    <div class='col-12'>
                        <div class='row padding-20-15'>
                            <form class='form' action="javascript:void(0)" id="update_lead_form" style='width:100%;'>
                                <div class='col-12'>
                                    <div class="form-group">
                                        <label for="name">Name <span class='required'>*</span></label>
                                        <input type='hidden' class="form-control" id="zen_id" name='zen_id' value='${requester.zen_req_id}'></input>
                                        <input type='hidden' class="form-control" id="id" name='id' value='${requester.id}'></input>
                                        <input class="form-control" id="name" placeholder='enter lead name'  value='${requester.name}' required></input>
                                    </div>
                                </div>
                            
                                <div class='col-12'>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input class="form-control" id="email" name="email" placeholder='enter lead email'  value='${requester.email}'></input>
                                    </div>
                                </div>
                                <div class='col-12'>
                                    <div class="form-group">
                                        <label for="phone">Phone <span class='required'>*</span></label>
                                        <input class="form-control" id="phone" name="phone" placeholder='enter lead phone number'  value='${requester.phone}' required></input>
                                    </div>
                                </div>
                                <div class='col-12'>
                                    <div class="form-group">
                                        <label for="care_status">Status <span class='required'>*</span></label>
                                        <select style='width: 100%;' class='form-control' id='care_status' name="care_status" required>
                                            <option value=''>---- Choose care status ----</option>
                                            ${templatingLoop(commonData.careStatus,(status) => {
                                                return `<option style='color:${status.color}' value='${status.id}'>${status.dataValue}</option>`
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div class='col-12'>
                                    <div class="form-group">
                                        <label for="sales_man">Salesman <span class='required'>*</span></label>
                                        <select style='width: 100%;'  class='form-control' id='sales_man' name="sales_man" required>
                                        <option value=''>---- Choose sales man ----</option>
                                        ${templatingLoop(commonData.salesman,(status) => {
                                            return `<option value='${status.id}'>${status.firstName} | ${status.email}</option>`
                                        })}
                                        </select>
                                    </div>
                                </div>
                                <div class='col-12'>
                                    <div class="form-group">
                                        <label for="note">Note</label>
                                        <textarea  class='form-control' id='note' name="note" placeholder='enter note'>${replaceNullOrTempty(requester.take_note)}</textarea>
                                    </div>
                                </div>
                                <div class='col-12' style='text-align: right;'>
                                    <button id='closeModal' type="button" class="btn btn-secondary btn-sm">Close</button>
                                    <button id='saveData'  type="submit" class="btn btn-primary btn-sm">Save</button>
                                </div>
                            </form>
                            <div class="alert-form alert alert-success" role="alert">
                                Saved data success, this form will close on 3 second!
                            </div>
                            <div class="alert-form alert alert-danger" role="alert">
                                Something error, please try again!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    async init() {
        let client = this._client;
        let parentClient = this._parentClient;
        let o2oApi = this.o2oApi;
        addEventClickToElement('#closeModal', (e) => {
            client.invoke('destroy');
        });
        renderSelect2('#care_status,#sales_man')
        $("#sales_man").val(this.dataUser.sales_man_id || '');
        $("#care_status").val(this.dataUser.care_status_id || '');
        addEventClickToElement('#saveData', async (e) => {
            var postData = {
                id: $("#id").val(),
                fullName: $("#name").val() || '',
                phone: $("#phone").val() || '',
                email: $("#email").val() || '',
                status: $("#care_status").val() || '',
                staffInCharge: $("#sales_man").val() || '',
                note: $("#note").val() || ''
            }
            if (!isNullOrTempty(postData.fullName) && !isNullOrTempty(postData.phone) &&
                !isNullOrTempty(postData.status) && !isNullOrTempty(postData.staffInCharge)) {
                if (!isNullOrTempty(postData.email) && (!isValidEmail(postData.email))) {
                    this.notify('Invalid email', false);
                } else {
                    try {
                        $(".customer_update > div").before(renderLoadingWithPanel())
                        var updateLead = (await o2oApi.updateLead(postData)).data.isSuccess;
                        if (updateLead) {
                            toastr.success('Update success');
                            var passParams = {
                                "reload": true,
                            };
                            parentClient.trigger('data_modal_passing', passParams);
                            //client.invoke('destroy');
                        }
                        $(".loading-panel").remove();
                    } catch (error) {
                        console.log('SERA-CD[Error]:' + error)
                        toastr.error('Something wrong when update lead, please try again');
                    }
                }
            }
        })
        // $("#sales_man").val(this.dataUser.sales_man_id || '')
    }
    async getCommonData() {
        let data = (await this.o2oApi.getCommonData()).data;
        let careStatus = _.filter(data.commonData, (o) => !o.isDelete)
        let salesman = data.users;
        let interests = data.interests;
        return {
            careStatus,
            salesman
        }
    }
    notify(text, type, timeout = 2000) {
        if (!type) {
            $(".alert-form.alert-danger").text(text).slideDown(200, function () {
                let el = this;
                setTimeout(() => {
                    $(el).slideUp(100);
                }, timeout);
            });
        } else {
            $(".alert-form.alert-success").text(text).slideDown(200, function () {
                let el = this;
                setTimeout(() => {
                    $(el).slideUp(100);
                }, timeout);
            });
        }
    }
}

export default CustomerUpdate