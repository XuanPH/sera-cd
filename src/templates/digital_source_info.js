import {
  addEventClickToElement,
  addEventShowHideHeader,
  templatingLoop
} from "../javascripts/lib/helpers";

export function renderDSI(leads) {
  return `<div class="card digital_source_info">
            <h5 class="card-header">
              <i class="fas fa-chevron-up showHide pointer"></i> Digital source info
            </h5>
            <div class="card-body">
              <div class="container">
                <div class="row">
                  <div class="col-12">
                    ${leads.conversion && leads.conversion !== "" && leads.conversion.length > 0 
                          ? (`<b>Conversion (Goals hit)</b> </br>` + templatingLoop(leads.conversion, (data) => { return `<div class="c-tag c-tag--red"><span dir="ltr">${data}</span></div>` })) 
                          : ''}
                  </div>
                  <div class="col-12">
                    ${leads.source_medium && leads.source_medium !== "" && leads.source_medium.length > 0 
                          ? ` <b>Source / Medium</b> </br>` + templatingLoop(leads.source_medium, (data) => { return `<div class="c-tag"><span dir="ltr">${data}</span></div>` }) 
                          : ''}
                  </div>
                  <div class="col-12">
                    ${leads.campaign_name && leads.campaign_name !== "" && leads.campaign_name.length > 0 
                          ? `<b>Campaign name</b> </br>` + templatingLoop(leads.campaign_name, (data) => { return `<div class="c-tag"><span dir="ltr">${data}</span></div>` }) 
                          : ''}
                  </div>
                  <div class="col-12">
                    ${leads.keywords_terms && leads.keywords_terms !== "" && leads.keywords_terms.length > 0 
                          ? `<b>Keyword and terms</b> </br>` + templatingLoop(leads.keywords_terms, (data) => { return `<div class="c-tag"><span dir="ltr">${data}</span></div>` }) 
                          : ''}
                  </div>
                </div >
              </div >
            </div >
          </div > `
}
export function initDSIFunction(_client) {
  addEventShowHideHeader('.digital_source_info', _client);
  setTimeout(() => {
    let length = $(".digital_source_info b").length;
    if (length === 0) {
      $(".digital_source_info .row").html(`<div class="col-12"><span><i>(Not available data)</i></span></div>`)
    }
  }, 200);
}