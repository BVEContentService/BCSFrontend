import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import store from "./store";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import VuetifyDialog from "vuetify-dialog";
import "vuetify-dialog/dist/vuetify-dialog.css";
import { EventBus } from "./utils/EventBus";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Vue.config.productionTip = false;

const requireComponent = require.context(
  "./components",
  false,
  /[A-Z]\w+\.(vue|js)$/
);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    camelCase(
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  Vue.component(componentName, componentConfig.default || componentConfig);
});

Sentry.init({
  Vue,
  dsn:
    "https://fcea37a32c8549f7a83f8e5086a02d21@o488451.ingest.sentry.io/5554523",
  autoSessionTracking: true,
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  logErrors: true
});

Vue.use(VuetifyDialog, {
  context: { vuetify },
  error: { icon: "mdi-alert-circle" },
  warning: { icon: "mdi-information" },
  success: { icon: "mdi-check-circle" }
});

axios.interceptors.request.use(
  config => {
    EventBus.$emit("setNetworkOverlay", true);
    if (localStorage.JWT_TOKEN) {
      if (config.headers.Authorization === "NONE") {
        delete config.headers["Authorization"];
      } else {
        config.headers.Authorization = `Bearer ${localStorage.JWT_TOKEN}`;
      }
    }
    return config;
  },
  err => {
    EventBus.$emit("setNetworkOverlay", false);
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  res => {
    EventBus.$emit("setNetworkOverlay", false);
    return res;
  },
  err => {
    EventBus.$emit("setNetworkOverlay", false);
    return Promise.reject(err);
  }
);

Vue.prototype.$http = axios;
Vue.prototype.$apiRootURL = process.env.VUE_APP_API_ROOT_URL;
Vue.prototype.$docRootURL = process.env.VUE_APP_DOC_ROOT_URL;

new Vue({
  router,
  vuetify,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");

router.beforeEach((to, from, next) => {
  EventBus.$emit("setOverlay", "");
  next();
});

console.log(
  "%cStop!",
  "color: #F00; font-size: 30px; -webkit-text-stroke: 1px black; font-weight:bold"
);
console.log(
  "This is part of your browser intended for developers.",
  "If someone told you to copy-and-paste something here, don't do it!",
  "It could allow them to take over your account, or do many other harmful things.",
  "If you don't understand what exactly you are doing here, you should close this window without doing anything."
);

/*window.onerror = function(error, url, line) {
  vm.$store.commit("onError", { error: error, url: url, line: line });
};*/
