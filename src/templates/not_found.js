import {
    addEventClickToElement,
    resizeContainerTo,
} from "../javascripts/lib/helpers";

export function renderNotFound(msg) {
    if (msg.code && msg.code === "createdLead") {
        return `<div class="notfound">
                   <div style='height: 100px;width: 300px;position: absolute;'><img class="loader" style='top: 30%;' src="spinner.gif" /></div>
                    <div class='bg_img'></div>
                    <div class='content' style=' width: 100%;'>
                        <span>Creating leads...</span>
                    </div>
                </div>`
    } else {
        return `<div class="notfound">
                    <div class='bg_img'></div>
                    <div class='content'>
                        <span>${msg.msg} <br/><a id="reloadA" href='javascript:void(0)'>Retry?</a></br<a></span>
                    </div>
                </div>`
    }

}
export function initNotFoundFunction(msg, client) {
    addEventClickToElement('.notfound a', (e) => {
        window.location.reload(true);
    });
    if (msg.code && msg.code === "createdLead") {
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    }
    if (msg.code && msg.code === "unAuthorize") {
        $("#reloadA").hide()
        $("#reloadA").after('<hr><span>After that, need refresh app to apply new token, following below image to refresh.  </span><img style="box-shadow: 2px 2px 5px;" src="./tutorial.png" />')
    }
    client && resizeContainerTo(client, 300);
}