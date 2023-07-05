<template>
  <v-list>
    <v-list-item link @click="$router.go(-1)" class="d-none d-lg-flex">
      <v-list-item-action>
        <v-icon>mdi-arrow-left</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ $t("t_back") }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="d-none d-lg-flex"></v-divider>

    <list-item-group :items="constantItems"></list-item-group>

    <template
      v-if="$store.state.profile && $store.state.profile.Privilege >= 10"
    >
      <v-divider></v-divider>
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
        position: "bottom-left"
      });
    },
    changeLanguage(newLang) {
      this.$root.$i18n.locale = newLang;
      this.$store.commit("onLangChanged", newLang);
    },
    toggleEnglishName() {
      this.$store.commit("toggleEnglishName");
    },
    reloadSidebar() {
      if (
        this.$store.state.profile &&
        this.$store.state.profile.Privilege >= 10
      ) {
        this.$http
          .head(this.$apiRootURL + "/files?validated=false")
          .then(response => {
            this.admin_invalidPackCount = parseInt(
              response.headers["content-range"].split("/")[1]
            );
          })
          .catch(exception => {
            handleNetworkErr(exception, this);
          });
      }
    }
  },
  mounted: function() {
    this.reloadSidebar();
    EventBus.$on("reloadSidebar", this.reloadSidebar);
  }
};
</script>
