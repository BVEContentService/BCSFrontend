<template>
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

    <list-item-group
      v-if="!profile"
      :items="logoutItems"
      avatar
    ></list-item-group>
    <div v-else>
      <v-list-item link to="/profile/detail">
        <v-list-item-avatar>
          <img :src="gravatarURL" style="background:white" />
        </v-list-item-avatar>
        <v-list-item-title>{{ profile.Name.Local }}</v-list-item-title>
      </v-list-item>
      <list-item-group itemclass="pl-8" :items="loginItems"></list-item-group>
    </div>

    <v-divider></v-divider>
    <list-item-group :items="constantItems"></list-item-group>
    <v-divider></v-divider>

    <template
      v-if="$store.state.profile && $store.state.profile.Privilege >= 10"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>
            {{ $t("t_frame_admin") }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/file/list">
        <v-list-item-action>
          <v-badge
            v-if="admin_invalidPackCount"
            :content="admin_invalidPackCount"
            overlap
          >
            <v-icon>mdi-file-multiple</v-icon>
          </v-badge>
          <v-icon v-else>mdi-file-multiple</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t("l_frame_files") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider></v-divider>

    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-translate</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-select
          :value="$store.state.lang"
          @change="changeLanguage"
          :items="locales"
          item-text="text"
          item-value="value"
          label="Language"
        >
          <template v-slot:item="data">
            <v-list-item v-bind="data.attrs" v-on="data.on">
              <div style="min-width: 16ch">{{ data.item.text }}</div>
              <div class="subtitle-2 d-none d-md-block">
                {{ data.item.glass }}
              </div>
            </v-list-item>
          </template>
        </v-select>
      </v-list-item-content>
    </v-list-item>
    <v-list-item link @click="toggleEnglishName()">
      <v-list-item-action style="margin-right: 18px">
        <v-switch :value="englishName"></v-switch>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>English Names</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { EventBus } from "../utils/EventBus.js";
export default {
  name: "sidebar",
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
    },
    locales() {
      return Object.entries(this.$i18n.messages).map(entry => ({
        value: entry[0],
        text: entry[1].t_lang_name,
        glass: entry[1].t_eat_glass
      }));
    }
  },
  data: function() {
    return {
      drawer: null,
      loginDialog: false,
      overlayState: "",
      constantItems: [
        {
          icon: "mdi-home",
          text: "l_frame_home",
          to: "/"
        },
        {
          icon: "mdi-folder-multiple",
          text: "l_frame_packages",
          to: "/package/list"
        },
        {
          icon: "mdi-information",
          text: "l_frame_credit",
          to: "/about"
        }
      ],
      loginItems: [
        {
          icon: "mdi-pencil",
          text: "l_frame_editprofile",
          to: "/profile/edit"
        },
        {
          icon: "mdi-exit-to-app",
          text: "l_frame_logout",
          click: this.logout
        }
      ],
      logoutItems: [
        {
          icon: "mdi-account",
          text: "l_frame_login",
          click: this.showLoginDialog
        },
        {
          icon: "mdi-pencil",
          text: "l_frame_register",
          to: "/user/register"
        }
      ],
      admin_invalidPackCount: 0
    };
  },
  methods: {
    showLoginDialog: function() {
      EventBus.$emit("setLoginDialog", true);
    },
    logout: function() {
      this.$store.commit("logout");
      this.$dialog.message.warning(this.$i18n.t("t_toast_logout"), {
        position: "top-right"
      });
    },
    changeLanguage(newLang) {
      this.$root.$i18n.locale = newLang;
      this.$store.commit("onLangChanged", newLang);
    },
    toggleEnglishName() {
      this.$store.commit("toggleEnglishName");
    }
  },
  mounted: function() {
    var vm = this;
    if (
      this.$store.state.profile &&
      this.$store.state.profile.Privilege >= 10
    ) {
      this.$http
        .head(this.$apiRootURL + "/files?validated=false")
        .then(function(response) {
          vm.admin_invalidPackCount = parseInt(
            response.headers["content-range"].split("/")[1]
          );
        })
        .catch(function(exception) {
          handleNetworkErr(exception, vm);
        });
    }
  }
};
</script>
