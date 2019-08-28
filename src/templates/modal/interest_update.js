import {
    addEventClickToElement,
    renderSelect2,
    templatingLoop,
    isNullOrTempty,
    formatMoney,
    renderLoadingWithPanel,
    renderSelect2Tags,
    getLocalStorage
} from '../../javascripts/lib/helpers';

class InterestUpdate {
    constructor(_client, dataUser, o2oApi, _parentClient) {
        this._client = _client;
        this._parentClient = _parentClient;
        this.dataUser = dataUser;
        this.o2oApi = o2oApi;
        this.commonData = [];
    }
    async render() {
        this.commonData = (await this.getCommonData());
        return `
            <div class='interest_update'>
                <div class="row">
                    <div class='col-12'>
                        <div class='row padding-20-15'>
                            ${templatingLoop(this.commonData.interests.interestConfigResponse,this.renderInterestItem)}
                        </div>
                        <div class='row padding-20-15'>
                            <div class='col-12' style='text-align: right;'>
                                <button id='closeModal' type="button" class="btn btn-secondary btn-sm">Close</button>
                                <button id='saveData'  type="submit" class="btn btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    renderInterestItem(item) {
        switch (item.inputType) {
            case 'remote':
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}</label>
                                <select style='width: 100%;' class='form-control select2 ${item.inputType}' id='${item.code}' name="${item.code}" multiple="multiple">
                                </select>
                            </div>
                        </div>`;
            case 'address':
                return ` <div class='col-${item.col}'>
                                <div class="form-group">
                                    <label for="${item.code}">${item.text}</label>
                                    <select style='width: 100%;' class='form-control select2 ${item.inputType}' id='${item.code}' name="${item.code}" multiple="multiple">
                                    </select>
                                </div>
                            </div>`;
            case 'dropdown':
                return ` <div class='col-${item.col}'>
                                <div class="form-group">
                                    <label for="${item.code}">${item.text}</label>
                                    <select style='width: 100%;' class='form-control ${item.inputType}' id='${item.code}' name="${item.code}" multiple="multiple">
                                    </select>
                                </div>
                            </div>`;
            case 'freeText':
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}</label>
                                <select style='width: 100%;' class='form-control ${item.inputType} select2--tags' id='${item.code}' name="${item.code}" multiple="multiple">
                                </select>
                            </div>
                        </div>`;
            case 'freedom':
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}</label>
                                <select style='width: 100%;' class='form-control ${item.inputType} select2--tags' id='${item.code}' name="${item.code}" multiple="multiple">
                                </select>
                            </div>
                        </div>`;
            case 'text':
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}</label>
                                <input class="form-control ${item.inputType}" id="${item.code}" name="${item.code}" placeholder='${item.text}'></input>
                            </div>
                        </div>`;
            case 'number':
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}  <b>0</b></label>
                                <input step='1000000' type="number" class="form-control ${item.inputType}" id="${item.code}" name="${item.code}" placeholder='${item.text}'></input>
                            </div>
                        </div>`;
            case 'boolean':
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}</label>
                                <div class="custom-control custom-radio">
                                    <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input">
                                    <label class="custom-control-label" for="customRadio1">Yes</label>
                                </div>
                                <div class="custom-control custom-radio">
                                    <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input">
                                    <label class="custom-control-label" for="customRadio2">No</label>
                                </div>
                            </div>
                        </div>`;
            default:
                return ` <div class='col-${item.col}'>
                            <div class="form-group">
                                <label for="${item.code}">${item.text}</label>
                                <input class="form-control ${item.inputType}" id="${item.code}" name="${item.code}" placeholder='${item.text}'></input>
                            </div>
                        </div>`;
        }
    }
    async init() {
        let client = this._client;
        let dataUser = this.dataUser;
        let o2oApi = this.o2oApi;
        let parentClient = this._parentClient;
        var currentInterest = dataUser.interest;
        addEventClickToElement('#closeModal', (e) => {
            client.invoke('destroy');
        });
        addEventClickToElement('#saveData', async (e) => {
            var postData = {
                id: dataUser.id,
                fullName: dataUser.name,
                phone: dataUser.phone,
                email: dataUser.email,
                status: dataUser.care_status_id,
                staffInCharge: dataUser.sales_man_id,
                note: dataUser.take_note,
                interest: {}
            }
            this.commonData.interests.interestConfigResponse.forEach(async (value, index) => {
                var values = [];
                if (_.filter(['dropdown', 'address', 'remote', 'freeText', 'freeTexts', 'freedom'], (o) => o === value.inputType).length > 0) {
                    values = $(`#${value.code}`).val();
                } else if (value.inputType === "boolean") {
                    var checker = $("#customRadio1:checked").length > 0 ? 1 : $("#customRadio2:checked").length > 0 ? 0 : -1
                    if (checker !== -1)
                        values.push((checker === 1 ? "yes" : "no"));
                } else {
                    var inputString = $(`#${value.code}`).val();
                    if (!isNullOrTempty(inputString))
                        values.push(inputString);
                }
                if (values.length > 0) postData.interest[value.code] = values;
            });
            try {
                $(".interest_update > div").before(renderLoadingWithPanel())
                var updateLead = (await o2oApi.updateLead(postData)).data.isSuccess;
                if (updateLead) {
                    //toastr.success("Update interest success");
                    var passParams = {
                        "reload": true,
                        "toastr": true,
                        "toastrType": true,
                        "message": "Updated success"
                    };
                    parentClient.trigger('data_modal_passing', passParams);
                    client.invoke('destroy');
                }
                $(".loading-panel").remove();
            } catch (error) {
                toastr.error('Something wrong when update lead, please try again');
                $(".loading-panel").remove();
            }
        })

        this.commonData.interests.interestConfigResponse.forEach(async (value, index) => {
            if (_.filter(['dropdown', 'address', 'remote'], (o) => o === value.inputType).length > 0) {
                var list = [];
                try {
                    list = (await o2oApi.referenceData(value.code)).data.data;
                } catch (error) {
                    console.error('SERA-CD[error]:', error);
                }
                renderSelect2(`#${value.code}`, {}, list, currentInterest);
            } else if (_.filter(['freeText', 'freeTexts', 'freedom'], (o) => o === value.inputType).length > 0) {
                var list = currentInterest[value.code] || [];
                renderSelect2Tags('.select2--tags', list);
            } else if (value.inputType === "number") {
                $(`#${value.code}`).bind('keyup change', (e) => {
                    var $input = $(e.target).val();
                    if ($input && !isNullOrTempty($input) && !isNaN($input)) {
                        $(`label[for=${value.code}] b`).html(formatMoney($input, 0));
                    } else {
                        $(`label[for=${value.code}] b`).html('0');
                    }
                });
                if (currentInterest[value.code]) {
                    $(`#${value.code}`).val(currentInterest[value.code][0]).trigger('change');
                }
            } else if (value.inputType === "boolean") {
                if (currentInterest[value.code]) {
                    if (currentInterest[value.code][0] === "yes") {
                        $("#customRadio1").trigger('click');
                    } else if (currentInterest[value.code][0] === "no") {
                        $("#customRadio2").trigger('click');
                    }
                }
            } else {
                if (currentInterest[value.code]) {
                    $(`#${value.code}`).val(currentInterest[value.code][0]).trigger('change');
                }
            }
        });
        // $("#sales_man").val(this.dataUser.sales_man_id || '')
    }

    async getCommonData() {
        let data = (await this.o2oApi.getCommonData()).data;
        let careStatus = _.filter(data.commonData, (o) => !o.isDelete)
        let salesman = data.users;
        let interests = data.interests;
        return {
            careStatus,
            salesman,
            interests
        }
    }
}

export default InterestUpdate