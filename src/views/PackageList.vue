<template>
  <narrow-container>
    <information-overlay
      style="position:absolute; z-index:100"
      :state="disablePager ? 'loading' : ''"
    ></information-overlay>
    <v-row>
      <v-col cols="2" md="1" class="pb-0">
        <v-btn color="success" link to="/package/edit">
          <v-icon class="mr-3">mdi-pencil</v-icon>
          {{ $t("l_pack_create") }}
        </v-btn>
      </v-col>
      <v-col cols="2" md="1" class="text-right pb-0">
        {{ $t("f_file_platform") }}
      </v-col>
      <v-col cols="10" sm="4" md="4" lg="2" class="pt-2 pb-0">
        <v-select
          class="pt-0 mt-0"
          v-model="filter_platform"
          :items="platformItems"
          item-text="text"
          item-value="value"
        ></v-select>
      </v-col>
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
      var vm = this;
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
        .then(function(response) {
          vm.disablePager = false;
          vm.offsetPackages = response.data;
          vm.totalLength = parseInt(
            response.headers["content-range"].split("/")[1]
          );
        })
        .catch(function(exception) {
          vm.disablePager = false;
          // Show as dialog if occured on switching pager
          // Show as overlay if occured on first entry
          handleNetworkErr(
            exception,
            vm,
            vm.offsetPackages.length ? "dialog" : "overlay"
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
