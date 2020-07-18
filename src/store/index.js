import Vue from "vue";
import Vuex from "vuex";
import i18n from "../i18n.js";

Vue.use(Vuex);

function tryLanguages() {
  var userLanguage = window.navigator.language || window.navigator.userLanguage;
  var languages = Object.keys(i18n.messages);
  if (languages.indexOf(userLanguage) >= 0) return userLanguage;
  for (var i = 0; i < languages.length; i++) {
    var langParts = languages[i].split("-");
    var userLangParts = userLanguage.split("-");
    if (langParts[0] == userLangParts[0]) return languages[i];
  }
  return "en";
}

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("JWT_TOKEN") || "",
    profile: JSON.parse(localStorage.getItem("PROFILE")) || null,
    lang: window.localStorage.getItem("LANGUAGE") || tryLanguages(),
    englishName: false
  },
  mutations: {
    login(state, payload) {
      state.token = payload.token;
      state.profile = payload.profile;
      localStorage.setItem("JWT_TOKEN", state.token);
      localStorage.setItem("PROFILE", JSON.stringify(state.profile));
    },
    refreshToken(state, payload) {
      state.token = payload;
    },
    profileUpdate(state, profile) {
      state.profile = profile;
      localStorage.setItem("PROFILE", JSON.stringify(state.profile));
    },
    logout(state) {
      state.token = "";
      state.profile = null;
      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("PROFILE");
    },
    toggleEnglishName(state) {
      state.englishName = !state.englishName;
    },
    onLangChanged(state, payload) {
      window.localStorage.setItem("LANGUAGE", payload);
      state.lang = payload;
    }
  }
});
