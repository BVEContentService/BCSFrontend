<template>
  <v-app id="inspire">
    <v-overlay :value="networkOverlayState" z-index="999"
      ><v-progress-circular indeterminate size="64"></v-progress-circular
    ></v-overlay>
    <v-navigation-drawer v-model="drawer" color="secondary" app clipped>
      <sidebar></sidebar>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="primary" dark dense>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        text
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">{{ $t("t_app_name") }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!profile">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              text
              @click="loginDialog = true"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-login-variant</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("l_frame_login") }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon text to="/user/register" v-bind="attrs" v-on="on">
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("l_frame_register") }}</span>
        </v-tooltip>
      </template>
      <template v-else>
        <v-menu open-on-hover bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" style="background: darkslategrey">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-avatar size="60" style="background: teal;">
                <v-icon x-large dark>mdi-account</v-icon>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link to="/profile/detail">
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{ profile.Name.Local }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ profile.Email }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>mdi-menu-right</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item link to="/profile/edit">
              <v-list-item-icon>
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  $t("l_frame_editprofile")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{
                  $t("l_frame_logout")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <v-menu open-on-hover bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon text v-bind="attrs" v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="item in locales"
              :key="item.value"
              @click="changeLanguage(item.value)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item link @click="toggleEnglishName()">
            <v-list-item-action style="margin-right: 18px">
              <v-switch :value="englishName"></v-switch>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>English Names</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
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
      overlayState: "",
      networkOverlayState: false
    };
  },
  computed: {
    profile() {
      return this.$store.state.profile;
    },
    locales() {
      return Object.entries(this.$i18n.messages).map(entry => ({
        value: entry[0],
        text: entry[1].t_lang_name,
        glass: entry[1].t_eat_glass
      }));
    },
    englishName() {
      return this.$store.state.englishName;
    }
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
    },
    changeLanguage(newLang) {
      this.$root.$i18n.locale = newLang;
      this.$store.commit("onLangChanged", newLang);
    },
    toggleEnglishName() {
      this.$store.commit("toggleEnglishName");
    },
    logout: function() {
      this.$store.commit("logout");
      this.$dialog.message.warning(this.$i18n.t("t_toast_logout"), {
        position: "bottom-left"
      });
    }
  },
  mounted: function() {
    EventBus.$on("setLoginDialog", shown => {
      this.loginDialog = shown;
    });
    EventBus.$on("setOverlay", type => {
      this.overlayState = type;
    });
    EventBus.$on("setNetworkOverlay", type => {
      this.networkOverlayState = type;
    });
    setInterval(this.checkTokenExpiry, 5 * 60 * 1000);
    this.checkTokenExpiry();
    this.$root.$i18n.locale = this.$store.state.lang;
  }
};
</script>
