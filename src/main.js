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

Vue.use(VuetifyDialog, {
  context: { vuetify },
  error: { icon: "mdi-alert-circle" },
  warning: { icon: "mdi-information" },
  success: { icon: "mdi-check-circle" }
});

axios.interceptors.request.use(
  config => {
    if (localStorage.JWT_TOKEN) {
      config.headers.Authorization = `Bearer ${localStorage.JWT_TOKEN}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

Vue.prototype.$http = axios;
Vue.prototype.$apiRootURL = process.env.VUE_APP_API_ROOT_URL;

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
