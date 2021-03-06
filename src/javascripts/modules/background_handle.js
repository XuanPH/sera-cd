import { getLocalStorage, isNullOrTempty } from "../lib/helpers";
import { string } from "postcss-selector-parser";

export function ticketSiderbar() {
  // (*)ticket siderbar
  //submit ticket on
  // this._client.on('ticket.save', function () {
  //     return 'Ok, bạn không có quyền lưu';
  // });
}

export async function newTicketSiderbar() {
  var client = this._client;
  client.on("instance.created", async function(context) {
    if (context.location === "new_ticket_sidebar") {
      var newTicketBar = client.instance(context.instanceGuid);
      var currentUser = (await newTicketBar.get("currentUser")).currentUser;
      var requester = await getLocalStorage("requester", true);
      if (requester) {
        newTicketBar.set(
          "ticket.subject",
          requester.subject ? requester.subject : "unknown requester"
        );
        newTicketBar.set("ticket.requester", {
          id: requester.zen_req_id ? requester.zen_req_id : ""
        });
        newTicketBar.set("ticket.assignee", {
          userId: currentUser.id,
          groupId: currentUser.groups[0].id
        });
        newTicketBar.invoke("ticket.collaborators.add", {
          email: requester.sales_man
        });
        newTicketBar.set("ticket.tags", ["SERA-CD"]);
        newTicketBar.set("ticket.priority", "low");
        newTicketBar.set("ticket.type", "question");
      }
    }
  });
  this._client.on("ticket.submit.start", function(data) {
    console.info("ticket submiting... =>", data);
  });
  this._client.on("ticket.submit.done", function(data) {
    console.info("ticket done... =>", data);
  });
  this._client.on("ticket.submit.fail", function(data) {
    console.info("ticket fail.... =>", data);
  });
}
