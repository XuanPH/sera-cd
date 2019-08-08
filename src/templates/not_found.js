import { addEventClickToElement } from "../javascripts/lib/helpers";
import App from "../javascripts/modules/app";

export function renderNotFound(msg) {
    return `<div class="notfound"><div class='bg_img'></div><div class='content'><span>${msg}, <a href='javascript:void(0)'>retry</a>?</br></span></div></div>`
}

export function renderLoading() {
    return `<img  class="loader" src="notfound.png" />`
}

export function initNotFoundFunction() {
    addEventClickToElement('.notfound a', (e) => {
        window.location.reload(true);
    });
}