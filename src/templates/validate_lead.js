import {
    addEventClickToElement
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
                            <span class='gray15'>You need update <b style='color: #dc3545;'>Direct line phone number</b> to get leads. <a class='sz15' href='#' id='updateZendeskData'>Update</a> or 
                            <a class='sz15' href='#' id='retryApp'>retry</a>?</span>
                        </div>
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
    }
}

export default ValidateLead