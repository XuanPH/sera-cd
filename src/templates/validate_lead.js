import {
    addEventClickToElement,
    resizeContainerTo
} from "../javascripts/lib/helpers";

class ValidateLead {
    constructor(client) {
        this.client = client;
        this.init = this._init.bind(this);
    }
    render() {
        // return `<div class='row' style='margin: 0;'>
        //     <div class='col-12'>
        //         <div class="form-group">
        //             <span class='gray15'>You need update at least 1 information (<b>Direct line phone number</b> or <b>Email</b>) to get leads. <a class='sz15' href='#' id='updateZendeskData'>Update</a> or 
        //             <a class='sz15' href='#' id='retryApp'>retry</a>?</span>
        //         </div>
        //     </div>
        // </div>`
        return `<div class='row' style='margin: 0;'>
                    <div class='col-12'>
                        <div class="form-group">
                            <span class='gray15'>You need follow 2 step below:
                            <ul>
                                <li> + <b>Update people phone number</b></li>
                                <li> + <b>Enable phone number as direct line </b></li>
                                <li><img style="box-shadow: 2px 2px 5px;margin: 10px 0px;" src="./tutorial2.png" /></li>
                                <li> + <b>After that click Retry button </b></li>
                            </ul> 
                        </div>
                    </div>
                    <div class='col-6'>
                        <button style='width: 100%;' type="button"  id='updateZendeskData' class="sz15 btn btn-outline-primary">Update</button>
                    </div>
                    <div class='col-6'>
                        <button style='width: 100%;' type="button" id='retryApp' class=" sz15 btn btn-outline-primary">Retry</button>
                    </div>
                </div>`
    }
    _init(dataUser) {
        addEventClickToElement('#updateZendeskData', (e) => {
            this.client.invoke('routeTo', 'user', dataUser.id)
        })
        addEventClickToElement('#retryApp', (e) => {
            window.location.reload(true);
        })
        resizeContainerTo(this.client, 330);
    }
}

export default ValidateLead