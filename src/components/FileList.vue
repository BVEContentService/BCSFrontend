<template>
  <v-expansion-panels multiple>
    <v-expansion-panel v-if="newFilePackageID >= 1">
      <v-expansion-panel-header
        color="primary"
        class="veph-dark justify-self-start"
      >
        <div>
          <v-icon dark class="mr-2">mdi-card-plus</v-icon>
          <small class="ml-2">{{ $t("t_file_create") }}</small>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form v-model="newFileIDFormValid" ref="editForm">
          <v-row>
            <v-col cols="12" sm="6" class="pb-0">
              <v-select
                v-model="newFileModel.Platform"
                :label="this.$i18n.t('f_file_platform')"
                :items="platformItems"
                item-text="text"
                item-value="value"
                :rules="[r_required, r_conflict]"
                @input="nextTickValidate"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" class="pb-0">
              <v-text-field
                v-model="newFileModel.Version"
                :label="this.$i18n.t('f_file_version')"
                :rules="[r_required, r_version, r_conflict]"
                @input="nextTickValidate"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <file-list-element
          :file="newFileModel"
          :createCallback="syncFileCreate"
          :updateCallback="syncFileUpdate"
          :removeCallback="syncFileRemove"
        ></file-list-element>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel v-for="file in sortedFileList" v-bind:key="file.ID">
      <v-expansion-panel-header
        :color="platformMap[file.Platform].bgColor"
        :class="platformMap[file.Platform].dark ? 'veph-dark' : 'veph'"
      >
        <template v-if="showFileID">#{{ file.ID }} v</template
        >{{ file.Version }}
        <small class="ml-2">{{ platformMap[file.Platform].name }}</small>
        <span
          v-if="file.NeedValidation && !file.Validated && !!file.RejectReason"
          class="ml-3 text-right"
        >
          <span class="d-table-cell"
            ><v-icon class="mr-1" :dark="platformMap[file.Platform].dark"
              >mdi-alert-circle</v-icon
            ><small>文件被退回; 更新可重提交</small></span
          >
        </span>
        <span
          v-if="file.NeedValidation && !file.Validated && !file.RejectReason"
          class="ml-3 text-right"
        >
          <span class="d-table-cell">{{ $t("t_file_validation_await") }}</span>
          <a
            :href="documentURL('filevalidation')"
            target="_blank"
            style="color:black"
            class="d-table-cell pl-2 pr-1"
          >
            <sub>{{ $t("t_file_validation_help") }}</sub>
          </a>
        </span>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-btn
          v-if="showFileID"
          link
          :to="'/package/detail/' + file.PackageID"
          class="mt-3"
        >
          <v-icon class="mr-3">mdi-folder</v-icon>
          {{ $t("l_file_show_package") }}
        </v-btn>
        <file-list-element
          :file="file"
          :createCallback="syncFileCreate"
          :updateCallback="syncFileUpdate"
          :removeCallback="syncFileRemove"
        ></file-list-element>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.v-expansion-panel-header {
  font-size: 1.5rem;
  padding: 12px 24px;
  min-height: 0 !important;
}
.veph-dark {
  color: white;
}
.veph-dark a {
  color: white !important;
}
.veph-dark div i {
  color: white !important;
}
</style>

<script>
import mapping from "../config/mapping.js";
import { getExternalDocUrl } from "../utils/DocHelper";
function versionCompare(v1, v2) {
  var lexicographical = false,
    zeroExtend = true,
    v1parts = v1.split("."),
    v2parts = v2.split(".");
  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }
  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }
  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }
  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }
  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }
    if (v1parts[i] == v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }
  if (v1parts.length != v2parts.length) {
    return -1;
  }
  return 0;
}
export default {
  name: "file-list",
  computed: {
    sortedFileList() {
      return [...this.value].sort(
        (a, b) => -versionCompare(a.Version, b.Version)
      );
    },
    platformItems() {
      return Object.entries(this.platformMap).map(t => ({
        text: t[1].name,
        value: t[0]
      }));
    }
  },
  data: function() {
    return {
      platformMap: mapping.platform,
      newFileIDFormValid: false,
      newFileModel: {
        ID: 0,
        PackageID: this.newFilePackageID,
        Platform: "hmmsim",
        Size: "123.45 MB",
        Version: "1.0",
        Service: "bcstianjin",
        URLParam: "",
        AuthParam: this.$store.state.profile.Email
      }
    };
  },
  methods: {
    nextTickValidate() {
      this.$nextTick(function() {
        this.$refs.editForm.validate();
      });
    },
    syncFileCreate(model) {
      this.value.push(model);

      // Reset form
      this.newFileModel.ID = 0;
      this.newFileModel.PackageID = this.newFilePackageID;
      this.newFileModel.Platform = "hmmsim";
      this.newFileModel.Size = "123.45 MB";
      this.newFileModel.Version = "1.0";
      this.newFileModel.Service = "bcstianjin";
      this.newFileModel.URLParam = "";
      this.newFileModel.AuthParam = this.$store.state.profile.Email;
    },
    syncFileUpdate(model) {
      for (var i = 0; i < this.value.length; i++) {
        if (this.value[i].ID == model.ID) {
          this.$set(this.value, i, model);
          break;
        }
      }
    },
    syncFileRemove(id) {
      for (var i = 0; i < this.value.length; i++) {
        if (this.value[i].ID == id) {
          this.value.splice(i, 1);
          break;
        }
      }
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_version(v) {
      return (
        !!String(v).match(/^\d+(\.\d+){1,3}$/) || this.$i18n.t("e_version_bad")
      );
    },
    r_conflict() {
      for (var i = 0; i < this.value.length; i++) {
        if (
          this.value[i].Platform == this.newFileModel.Platform &&
          this.value[i].Version == this.newFileModel.Version
        ) {
          return this.$i18n.t("e_204");
        }
      }
      return true;
    },
    documentURL(topic) {
      return getExternalDocUrl(this, topic);
    }
  },
  props: ["value", "newFilePackageID", "showFileID"]
};
</script>
