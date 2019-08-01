import { addEventClickToElement } from "../javascripts/lib/helpers";
import App from "../javascripts/modules/app";

export function renderNotFound() {
    return `<div class="notfound"><div class='bg_img'></div><span>Data not found, <a href='javascript:void(0)'>retry</a>?</br></span></div>`
}

export function renderLoading() {
    return `<img  class="loader" src="notfound.png" />`
}

export function initNotFoundFunction() {
    addEventClickToElement('.notfound a', (e) => {
        window.location.reload(true);
    });
}