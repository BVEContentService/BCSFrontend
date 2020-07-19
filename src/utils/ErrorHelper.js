import { EventBus } from "./EventBus.js";
export function handleNetworkErr(error, vm, method = "dialog") {
  var errorString = "";
  if (error.response) {
    if (error.response.data.ErrorCode == 211) {
      vm.$store.commit("logout");
      EventBus.$emit("setLoginDialog", true);
      errorString = vm.$i18n.t("e_token_expire");
      if (method == "dialog") return;
    } else {
      errorString = "HTTP Error Code: " + error.response.status + "<br>";
      if (error.response.data.ErrorCode) {
        if (vm.$i18n.te("e_" + error.response.data.ErrorCode)) {
          if (error.response.data.Data) {
            errorString = vm.$i18n.t("e_" + error.response.data.ErrorCode, {
              data: error.response.data.Data
            });
          } else {
            errorString = vm.$i18n.t("e_" + error.response.data.ErrorCode);
          }
        } else {
          errorString +=
            "Internal Error Code: " + error.response.data.ErrorCode + "<br>";
          errorString += "Reason: " + error.response.data.Msg;
        }
        vm.$store.commit("onBackendException", {
          status: error.response.status,
          code: error.response.data.ErrorCode,
          data: error.response.data.Data,
          request: JSON.stringify(error.config)
        });
      } else {
        errorString += JSON.stringify(error.response.data);
        vm.$store.commit("onError", {
          error: JSON.stringify(error.response.data),
          url: JSON.stringify(error.config),
          line: "NIO"
        });
      }
    }
  } else if (error.request) {
    errorString = vm.$i18n.t("e_network");
    console.log(JSON.stringify(error));
    vm.$store.commit("onError", {
      error: error.message,
      url: JSON.stringify(error.config),
      line: "NIO"
    });
  } else {
    errorString = error.message;
    vm.$store.commit("onError", {
      error: error.message,
      url: JSON.stringify(error.config),
      line: "NIO"
    });
  }
  if (method == "dialog") {
    vm.$dialog.error({
      title: vm.$i18n.t("t_error_title"),
      text: errorString
    });
  } else if (method == "overlay") {
    EventBus.$emit("setOverlay", errorString);
  }
  return errorString;
}
