<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" color="secondary" app clipped>
      <sidebar></sidebar>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="primary" dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">{{ $t("t_app_name") }}</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-dialog v-model="loginDialog" width="unset">
        <login-dialog></login-dialog>
      </v-dialog>
      <information-overlay :key="1" :state="overlayState"></information-overlay>
      <v-slide-y-transition hide-on-leave>
        <router-view v-show="!overlayState" style="height: 100%"></router-view>
      </v-slide-y-transition>
    </v-main>
  </v-app>
</template>

<script>
import { EventBus } from "./utils/EventBus.js";
import { handleNetworkErr } from "./utils/ErrorHelper.js";
export default {
  data: function() {
    return {
      drawer: null,
      loginDialog: false,
      overlayState: ""
    };
  },
  methods: {
    checkTokenExpiry() {
      if (!this.$store.state.token) return;
      var expiry = new Date(
        require("jsonwebtoken").decode(this.$store.state.token).exp * 1000
      );
      if (expiry <= Date.now()) {
        this.$store.commit("logout");
      } else if (expiry - Date.now() < 10 * 60 * 1000) {
        this.$http
          .get(this.$apiRootURL + "/auth/refresh_token")
          .then(response => {
            this.$store.commit("refreshToken", response.data.token);
          })
          .catch(exception => {
            handleNetworkErr(exception, this);
          });
      }
    }
  },
  mounted: function() {
    EventBus.$on("setLoginDialog", shown => {
      this.loginDialog = shown;
    });
    EventBus.$on("setOverlay", type => {
      this.overlayState = type;
    });
    setInterval(this.checkTokenExpiry, 5 * 60 * 1000);
    this.checkTokenExpiry();
    this.$root.$i18n.locale = this.$store.state.lang;
  }
};
</script>
