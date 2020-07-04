<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" color="secondary" app clipped>
      <v-list>
        <v-list-item link @click="$router.go(-1)">
          <v-list-item-action>
            <v-icon>mdi-arrow-left</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ $t("t_back") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-if="!profile" link @click="loginDialog=true">
          <v-list-item-avatar>
            <v-icon style="background:white">mdi-account</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>{{ $t("l_frame_login") }}</v-list-item-title>
        </v-list-item>
        <div v-if="profile">
          <v-list-item link to="/profile/detail">
            <v-list-item-avatar>
              <img :src="gravatarURL" style="background:white" />
            </v-list-item-avatar>
            <v-list-item-title>{{ profile.Name.Local }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="pl-8" link @click="logout()">
            <v-list-item-action>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t("l_frame_logout") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-divider></v-divider>
        <v-list-item v-for="item in constantItems" :key="item.text" link :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link @click="toggleEnglishName()">
          <v-list-item-action>
            <v-switch :value="englishName"></v-switch>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>English Name</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="test()">
          <v-list-item-action>
            <v-icon>mdi-history</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Test</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
export default {
  props: {
    source: String
  },
  computed: {
    profile() {
      return this.$store.state.profile;
    },
    gravatarURL() {
      if (this.$store.state.profile.Email) {
        return (
          "https://www.gravatar.com/avatar/" +
          require("crypto")
            .createHash("md5")
            .update(this.$store.state.profile.Email)
            .digest("hex")
        );
      } else {
        return "";
      }
    },
    englishName() {
      return this.$store.state.englishName;
    }
  },
  data: function() {
    return {
      drawer: null,
      loginDialog: false,
      overlayState: "",
      constantItems: [
        { icon: "mdi-home", text: this.$i18n.t("l_frame_home"), to: "/" },
        {
          icon: "mdi-folder-multiple",
          text: this.$i18n.t("l_frame_packages"),
          to: "/package/list"
        },
        {
          icon: "mdi-information",
          text: this.$i18n.t("l_frame_credit"),
          to: "/about"
        }
      ]
    };
  },
  methods: {
    logout: function() {
      this.$store.commit("logout");
      this.$dialog.message.warning(this.$i18n.t("t_toast_logout"), {
        position: "top-right"
      });
    },
    test() {
      EventBus.$emit("reloadPackageList");
    },
    toggleEnglishName() {
      this.$store.commit("toggleEnglishName");
    }
  },
  mounted: function() {
    EventBus.$on("setLoginDialog", shown => {
      this.loginDialog = shown;
    });
    EventBus.$on("setOverlay", type => {
      this.overlayState = type;
    });
  }
};
</script>
