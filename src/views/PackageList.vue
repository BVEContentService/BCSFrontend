<template>
  <narrow-container>
    <v-row>
      <div
        class="pb-0 ml-5 mt-3 mr-5 mb-0 d-inline-block"
        v-if="
          this.$store.state.profile && this.$store.state.profile.Privilege >= 0
        "
      >
        <v-btn color="success" link to="/package/edit">
          <v-icon class="mr-3">mdi-pencil</v-icon>
          {{ $t("l_pack_create") }}
        </v-btn>
      </div>
      <div class="pb-0 ml-5 mt-5 mb-0 d-inline-block">
        <v-select
          class="pt-0 mt-0"
          v-model="filter_platform"
          :label="this.$i18n.t('f_file_platform')"
          :items="platformItems"
          item-text="text"
          item-value="value"
        ></v-select>
      </div>
      <div class="pb-0 ml-5 mt-5 mb-0 d-inline-block">
        <v-text-field
          class="pt-0 mt-0"
          :label="this.$i18n.t('t_search')"
          v-model="filter_keyword"
          append-icon="mdi-magnify"
          @click:append="fetchPackagesD"
          @keydown.enter="fetchPackagesD"
        ></v-text-field>
      </div>
    </v-row>
    <paginated-list
      tag="package-list-element"
      :items="offsetPackages"
      :totalLength="totalLength"
      :disabled="disablePager"
      :switchCallback="fetchPackagesR"
    ></paginated-list>
  </narrow-container>
</template>

<script>
import mapping from "../config/mapping.js";
import { handleNetworkErr } from "../utils/ErrorHelper.js";
export default {
  computed: {
    platformItems() {
      return [{ text: this.$i18n.t("t_filter_plus"), value: "%2b" }].concat(
        Object.entries(mapping.platform).map(t => ({
          text: t[1].name,
          value: t[0]
        }))
      ).concat([{ text: this.$i18n.t("t_filter_all"), value: null }]);
    }
  },
  data: () => ({
    offsetPackages: [],
    totalLength: 10,
    filter_platform: "%2b",
    filter_keyword: null,
    disablePager: true,
    pager_L: 0,
    pager_R: 9
  }),
  watch: {
    filter_platform(newValue) {
      this.fetchPackagesF(newValue, this.filter_keyword);
    }
  },
  methods: {
    fetchPackagesD() {
      console.log(this);
      this.fetchPackages3(
        this.filter_platform,
        this.filter_keyword,
        this.pager_L,
        this.pager_R
      );
    },
    fetchPackagesR(rangeL, rangeR) {
      this.fetchPackages3(
        this.filter_platform,
        this.filter_keyword,
        rangeL,
        rangeR
      );
    },
    fetchPackagesF(platform, keyword) {
      this.fetchPackages3(platform, keyword, this.pager_L, this.pager_R);
    },
    fetchPackages3(platform, keyword, rangeL, rangeR) {
      this.pager_L = rangeL;
      this.pager_R = rangeR;
      this.disablePager = true;
      var requestURL = this.$apiRootURL + "/packages";
      if (!!platform && !!keyword) {
        requestURL +=
          "?platform=" + platform + "&keyword=" + encodeURIComponent(keyword);
      } else if (platform) {
        requestURL += "?platform=" + platform;
      } else if (keyword) {
        requestURL += "?keyword=" + encodeURIComponent(keyword);
      }
      this.$http
        .get(requestURL, {
          headers: {
            Range: "packages=" + rangeL + "-" + rangeR
          }
        })
        .then(response => {
          this.disablePager = false;
          this.offsetPackages = response.data;
          this.totalLength = parseInt(
            response.headers["content-range"].split("/")[1]
          );
        })
        .catch(exception => {
          this.disablePager = false;
          // Show as dialog if occured on switching pager
          // Show as overlay if occured on first entry
          handleNetworkErr(
            exception,
            this,
            this.offsetPackages.length ? "dialog" : "overlay"
          );
        });
    }
  },
  mounted() {
    //if (!this.$store.state.packageList || !this.$store.state.packageList.length)
    this.fetchPackagesD();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchPackagesD();
    next();
  }
};
</script>
