<template>
  <narrow-container>
    <information-overlay
      style="position:absolute; z-index:100"
      :state="disablePager ? 'loading' : ''"
    ></information-overlay>
    <v-row>
      <div class="pb-0 ma-5 mb-0 mt-3 d-inline-block">
        <v-btn color="success" link to="/package/edit">
          <v-icon class="mr-3">mdi-pencil</v-icon>
          {{ $t("l_pack_create") }}
        </v-btn>
      </div>
      <div class="pb-0 ma-5 mb-0 d-inline-block">
        <v-select
          class="pt-0 mt-0"
          v-model="filter_platform"
          :label="this.$i18n.t('f_file_platform')"
          :items="platformItems"
          item-text="text"
          item-value="value"
        ></v-select>
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
      return [{ text: this.$i18n.t("t_filter_all"), value: null }].concat(
        Object.entries(mapping.platform).map(t => ({
          text: t[1].name,
          value: t[0]
        }))
      );
    }
  },
  data: () => ({
    offsetPackages: [],
    totalLength: 10,
    filter_platform: null,
    disablePager: true,
    _pager_L: 0,
    _pager_R: 9
  }),
  watch: {
    filter_platform(newValue) {
      this.fetchPackagesF(newValue);
    }
  },
  methods: {
    fetchPackagesD() {
      this.fetchPackages3(null, 0, 9);
    },
    fetchPackagesR(rangeL, rangeR) {
      this.fetchPackages3(this.filter_platform, rangeL, rangeR);
    },
    fetchPackagesF(platform) {
      this.fetchPackages3(platform, this._pager_L, this._pager_R);
    },
    fetchPackages3(platform, rangeL, rangeR) {
      this._pager_L = rangeL;
      this._pager_R = rangeR;
      this.disablePager = true;
      var requestURL = this.$apiRootURL + "/packages";
      if (platform) {
        requestURL += "?platform=" + platform;
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
