import { getUser, getGroup } from '../../api/zen_ticket_api'
import { addEventClickToElement } from '../../javascripts/lib/helpers';

class CustomerUpdate {
    constructor(paramas){

    }
    render() {
        return `
            <div class='create_ticket'>
                <div class="row">
                    <div class='col-12'>
                        <div class='row padding-20-15'>
                            <div class='col-12'>
                                <div class="form-group">
                                    <label for="ccs">Tên</label>
                                     <input class="form-control" id="name">${requester.name}</input>
                                </div>
                            </div>
                            <div class='col-12'>
                                <div class="form-group">
                                    <label for="ccs">Email</label>
                                     <input class="form-control" id="email"></input>
                                </div>
                            </div>
                            <div class='col-12'>
                                <div class="form-group">
                                    <label for="ccs">Phone</label>
                                    <input class="form-control" id="phone"></input>
                                </div>
                            </div>
                            <div class='col-12' style='text-align: right;'>
                                <button id='cancelFilter' type="button" class="btn btn-secondary btn-sm">Cancel</button>
                                <button id='applyFilter' type="button" class="btn btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

export function initCreateTicketFunction(client) {
    addEventClickToElement('#closeModal', (e) => { client.invoke('destroy'); });
}

//////////////////////////////////////////////////////////////////////////////////////