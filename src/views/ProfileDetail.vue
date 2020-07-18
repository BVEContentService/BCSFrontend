<template>
  <narrow-container>
    <div class="d-flex flex-wrap flex-container">
      <div class="col1">
        <div style="position: relative">
          <img class="profile-img" :src="gravatarURL" style="max-width:240px" />
          <edit-fab v-if="canEdit" :to="editURL"></edit-fab>
        </div>
        <h1 class="mb-4 mt-2">{{ displayName }}</h1>
        <p class="mb-1">
          <v-icon class="mr-2">mdi-account</v-icon>
          <em>{{ profile.Username }}</em>
        </p>
        <p v-if="profile.Email" class="mb-1">
          <v-icon class="mr-2">mdi-email</v-icon>
          <a :href="'mailto:' + profile.Email">{{ profile.Email }}</a>
        </p>
        <p v-if="profile.Homepage" class="mb-1">
          <v-icon class="mr-2">mdi-earth</v-icon>
          <a :href="profile.Homepage">{{ profile.Homepage }}</a>
        </p>
      </div>
      <div class="col2">
        <div class="mt-4" v-html="profile.Description"></div>
        <v-divider class="mt-5 mb-3"></v-divider>
        <paginated-list
          tag="package-list-element"
          :items="profile.Packages"
          :totalLength="profile.Packages.length"
          :switchCallback="updatePackagePager"
        ></paginated-list>
      </div>
    </div>
  </narrow-container>
</template>

<style scoped>
.col1 {
  width: 260px;
}
.col2 {
  flex-grow: 1;
  min-width: 500px;
}
h1 {
  line-height: 1em;
}
.profile-img {
  width: 100%;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  border: 2px solid gray;
  border-radius: 6px;
}
</style>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { EventBus } from "../utils/EventBus.js";
import { s3 } from "../utils/String3Helper";
export default {
  pageTitle: "My Profile",
  data: function() {
    var t_loading = this.$i18n.t("t_loading");
    return {
      profile: {
        Email: "",
        Username: t_loading,
        Description: t_loading,
        Homepage: "",
        Name: {
          Local: t_loading,
          English: t_loading,
          Tag: t_loading
        },
        Packages: []
      },
      pagerRangeL: 0,
      pagerRangeR: 9
    };
  },
  computed: {
    gravatarURL() {
      if (this.profile.Email) {
        return (
          "https://www.gravatar.com/avatar/" +
          require("crypto")
            .createHash("md5")
            .update(this.profile.Email)
            .digest("hex")
        );
      } else {
        return (
          "https://via.placeholder.com/200?text=" + this.$i18n.t("t_loading")
        );
      }
    },
    displayName() {
      return s3(this.profile.Name, this.$store.state.englishName);
    },
    slicedPackage() {
      return this.profile.Packages.slice(
        this.pagerRangeL,
        this.pagerRangeR + 1
      );
    },
    canEdit() {
      return (
        this.$store.state.profile &&
        (this.$store.state.profile.ID == this.profile.ID ||
          this.$store.state.profile.Privilege >= 50)
      );
    },
    editURL() {
      return "/profile/edit/" + this.profile.ID;
    }
  },
  methods: {
    fetchProfile(paramID) {
      EventBus.$emit("setOverlay", "loading");
      var uid;
      if (paramID && paramID == parseInt(paramID, 10)) {
        uid = paramID;
      } else if (this.$store.state.profile) {
        uid = this.$store.state.profile.ID;
      } else {
        this.$router.push("/");
        return;
      }
      var that = this;
      this.$http
        .get(this.$apiRootURL + "/uploaders/" + uid)
        .then(function(responseB) {
          that.profile = responseB.data;
          // Let the view model attach somewhere
          if (!that.profile.Packages) that.profile.Packages = [];
          EventBus.$emit("setOverlay", "");
        })
        .catch(function(exception) {
          handleNetworkErr(exception, that, "overlay");
        });
    },
    updatePackagePager(rangeL, rangeR) {
      // For future usage, just in case the profile package list backend supports pagination
      this.pagerRangeL = rangeL;
      this.pagerRangeR = rangeR;
    }
  },
  mounted() {
    this.fetchProfile(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchProfile(to.params.id);
    next();
  }
};
</script>
