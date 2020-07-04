import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "" || localStorage.getItem("JWT_TOKEN"),
    profile: null || JSON.parse(localStorage.getItem("PROFILE")),
    packageList: [],
    englishName: false
  },
  mutations: {
    login(state, payload) {
      state.token = payload.token;
      state.profile = payload.profile;
      localStorage.setItem("JWT_TOKEN", state.token);
      localStorage.setItem("PROFILE", JSON.stringify(state.profile));
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
    packListLoad(state, payload) {
      state.packageList = payload;
    },
    packListUpdate(state, payload) {
      state.packageList[payload.ID] = payload;
    },
    packListRemove(state, id) {
      if (state.packageList[id]) delete state.packageList[id];
    }
  }
});
