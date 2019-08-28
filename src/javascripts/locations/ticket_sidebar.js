import App from "../modules/app";
import Modal from "../modules/modal";
/* global ZAFClient */
var client = ZAFClient.init();

client.on("app.registered", function(appData) {
  return init(appData.context.location, client, appData);
});
client.on("app.willDestroy", function(appData) {
  clearInterval();
});
// client.on('instances', function (data) {
//   var instanceGuids = Object.keys(data.instances);
//   Object.keys(data.instances).forEach(function (instanceGuid) {
//     if (data.instances[instanceGuid].location === 'new_ticket_sidebar') {
//     }
//   });
// });

const init = (location, client, appData) => {
  localStorage.removeItem("token");
  localStorage.removeItem("leadId");
  if (location === "modal") {
    return new Modal(client, appData);
  } else {
    return new App(client, appData, location);
  }
};
