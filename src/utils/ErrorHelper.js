import { EventBus } from "./EventBus.js";
export function handleNetworkErr(error, vue, method = "dialog") {
  var errorString = "";
  if (error.response) {
    if (error.response.status == 401) {
      vue.$store.commit("logout");
      EventBus.$emit("setLoginDialog", true);
      errorString = vue.$i18n.t("e_token_expire");
      if (method == "dialog") return;
    } else {
      errorString = "HTTP Error Code: " + error.response.status + "<br>";
      if (error.response.data.ErrorCode) {
        if (vue.$i18n.te("e_" + error.response.data.ErrorCode)) {
          errorString = vue.$i18n.t("e_" + error.response.data.ErrorCode);
        } else {
          errorString +=
            "Internal Error Code: " + error.response.data.ErrorCode + "<br>";
          errorString += "Reason: " + error.response.data.Msg;
        }
      } else {
        errorString += JSON.stringify(error.response.data);
      }
    }
  } else if (error.request) {
    errorString = vue.$i18n.t("e_network");
  } else {
    errorString = error.message;
  }
  if (method == "dialog") {
    vue.$dialog.error({
      title: vue.$i18n.t("t_error_title"),
      text: errorString
    });
  } else if (method == "overlay") {
    EventBus.$emit("setOverlay", errorString);
  }
  return errorString;
}
