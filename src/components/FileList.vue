<template>
  <v-expansion-panels multiple>
    <v-expansion-panel>
      <v-expansion-panel-header color="primary" class="veph-dark justify-self-start">
        <div>
          <v-icon dark class="mr-2">mdi-card-plus</v-icon>
          <span>{{ $t("t_file_create") }}</span>
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
        <file-list-component
          :file="newFileModel"
          :createCallback="syncFileCreate"
          :updateCallback="syncFileUpdate"
          :removeCallback="syncFileRemove"
        ></file-list-component>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel v-for="file in sortedFileList" v-bind:key="file.ID">
      <v-expansion-panel-header
        :color="platformMap[file.Platform].bgColor"
        :class="platformMap[file.Platform].dark ? 'veph-dark' : 'veph'"
      >
        {{ file.Version }}
        <small class="ml-2">{{ platformMap[file.Platform].name }}</small>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <file-list-component
          :file="file"
          :createCallback="syncFileCreate"
          :updateCallback="syncFileUpdate"
          :removeCallback="syncFileRemove"
        ></file-list-component>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style>
.v-expansion-panel-header {
  font-size: 1.5rem;
  padding: 12px 24px;
  min-height: 0 !important;
}
.veph-dark {
  color: white;
}
.veph-dark div i {
  color: white !important;
}
</style>

<script>
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
  name: "file-list-element",
  computed: {
    sortedFileList() {
      return [...this.value.Files].sort(
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
      platformMap: {
        openbve: { name: "OpenBVE", bgColor: "#636363", dark: true },
        bvets5: { name: "BVE 5", bgColor: "#A7DC41", dark: false },
        hmmsim: { name: "Hmmsim", bgColor: "#569E7B", dark: true },
        bvets6: { name: "BVE 6", bgColor: "#000000", dark: true }
      },
      newFileIDFormValid: false,
      newFileModel: {
        ID: 0,
        PackageID: this.value.ID,
        Platform: "openbve",
        Version: "1.0",
        Service: "plain"
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
      this.value.Files.push(model);
    },
    syncFileUpdate(model) {
      for (var i = 0; i < this.value.Files.length; i++) {
        if (this.value.Files[i].ID == model.ID) {
          this.$set(this.value.Files, i, model);
          break;
        }
      }
    },
    syncFileRemove(id) {
      for (var i = 0; i < this.value.Files.length; i++) {
        if (this.value.Files[i].ID == id) {
          this.value.Files.splice(i, 1);
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
      for (var i = 0; i < this.value.Files.length; i++) {
        if (
          this.value.Files[i].Platform == this.newFileModel.Platform &&
          this.value.Files[i].Version == this.newFileModel.Version
        ) {
          return this.$i18n.t("e_204");
        }
      }
      return true;
    }
  },
  props: ["value"]
};
</script>
