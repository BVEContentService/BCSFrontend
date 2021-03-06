<template>
  <narrow-container>
    <v-row>
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
      <div class="pb-0 ma-5 mt-1 mb-0 d-inline-block">
        <p class="mb-0">
          <small>{{ $t("f_file_validation") }}</small>
        </p>
        <v-radio-group v-model="filter_validated" row class="pt-0 mt-0">
          <v-radio
            class="mr-0"
            v-for="n in 3"
            :key="n"
            :value="['null', 'true', 'false'][n - 1]"
            :color="['info', 'success', 'error'][n - 1]"
          ></v-radio>
        </v-radio-group>
      </div>
    </v-row>
    <v-row>
      <v-col cols="12">
        <paginated-list
          :totalLength="totalLength"
          :disabled="disablePager"
          :switchCallback="fetchFilesR"
        >
          <file-list
            v-model="files"
            :newFilePackageID="0"
            :showFileID="true"
          ></file-list>
        </paginated-list>
      </v-col>
    </v-row>
  </narrow-container>
</template>

<style scoped>
.v-input__slot {
  margin-bottom: 0;
}
.v-input--selection-controls__ripple {
  margin-bottom: 0;
}
.v-text-field__details {
  display: none;
}
</style>

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
    totalLength: 10,
    disablePager: true,
    files: [],
    filter_platform: null,
    filter_validated: "false",
    _pager_L: 0,
    _pager_R: 9
  }),
  watch: {
    filter_platform(newValue) {
      this.fetchFilesF(newValue, this.filter_validated);
    },
    filter_validated(newValue) {
      this.fetchFilesF(this.filter_platform, newValue);
    }
  },
  methods: {
    fetchFilesD() {
      this.fetchFiles4(null, "false", 0, 9);
    },
    fetchFilesR(rangeL, rangeR) {
      this.fetchFiles4(
        this.filter_platform,
        this.filter_validated,
        rangeL,
        rangeR
      );
    },
    fetchFilesF(platform, validated) {
      this.fetchFiles4(platform, validated, this._pager_L, this._pager_R);
    },
    fetchFiles4(platform, validated, rangeL, rangeR) {
      this._pager_L = rangeL;
      this._pager_R = rangeR;
      this.disablePager = true;
      var requestURL = this.$apiRootURL + "/files";
      // Model binding is problematic with the null value so we used string instead
      if (validated == "null") {
        validated = null;
      } else if (validated == "true") {
        validated = true;
      } else if (validated == "false") {
        validated = false;
      }
      if (!!platform && validated !== null) {
        requestURL += "?platform=" + platform + "&validated=" + validated;
      } else if (platform) {
        requestURL += "?platform=" + platform;
      } else if (validated !== null) {
        requestURL += "?validated=" + validated;
      }
      this.$http
        .get(requestURL, {
          headers: {
            Range: "files=" + rangeL + "-" + rangeR
          }
        })
        .then(response => {
          this.files = response.data;
          this.totalLength = parseInt(
            response.headers["content-range"].split("/")[1]
          );
          if (!this.files) this.files = [];
          this.disablePager = false;
        })
        .catch(exception => {
          this.disablePager = false;
          // Show as dialog if occured on switching pager
          // Show as overlay if occured on first entry
          handleNetworkErr(
            exception,
            this,
            this.files.length ? "dialog" : "overlay"
          );
        });
    }
  },
  mounted() {
    this.fetchFilesD();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchFilesD();
    next();
  }
};
</script>
