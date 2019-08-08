import {
    addEventClickToElement,
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
                        <span>${msg},<a href='javascript:void(0)'>retry</a>?</br></span>
                    </div>
                </div>`
    }

}
export function initNotFoundFunction(msg) {
    addEventClickToElement('.notfound a', (e) => {
        window.location.reload(true);
    });
    if (msg.code && msg.code === "createdLead") {
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    }
}