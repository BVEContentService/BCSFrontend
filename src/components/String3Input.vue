<template>
  <v-row>
    <v-col cols="12" :md="colsMd" class="pb-0 pt-0">
      <v-text-field
        v-model="value.Local"
        :label="this.$i18n.t('f_s3_local')"
        :error-messages="localErrors"
      ></v-text-field>
    </v-col>
    <v-col
      cols="12"
      :md="colsMd"
      v-if="shouldShowEnglishInput"
      class="pb-0 pt-0"
    >
      <v-text-field
        v-model="value.English"
        :label="this.$i18n.t('f_s3_english')"
        :error-messages="englishErrors"
      ></v-text-field>
    </v-col>
    <v-col cols="12" :md="colsMd" class="pb-0 pt-0">
      <v-text-field
        v-model="value.Tag"
        :label="this.$i18n.t('f_s3_tag')"
        :error-messages="tagErrors"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import VInput from "vuetify/lib/components/VInput/VInput.js";
var englishRegex = /^[\s\w\d\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*$/;
export default {
  name: "string-3-input",
  extends: VInput,
  computed: {
    colsMd() {
      return this.vertical ? 12 : 4;
    },
    localErrors() {
      if (!this.value.Local) return [this.$i18n.t("e_s3_local_req")];
      if (this.value.Local != this.value.Local.trim())
        return [this.$i18n.t("e_str_trim")];
      return [];
    },
    englishErrors() {
      if (this.shouldShowEnglishInput) {
        if (!this.value.English) return [this.$i18n.t("e_s3_english_req")];
        if (this.value.English != this.value.English.trim())
          return [this.$i18n.t("e_str_trim")];
        if (!String(this.value.English).match(englishRegex))
          return [this.$i18n.t("e_s3_english_bad")];
      }
      return [];
    },
    tagErrors() {
      if (!this.value.Tag) return [];
      if (this.value.Tag != this.value.Tag.trim())
        return [this.$i18n.t("e_str_trim")];
      return [];
    },
    ok() {
      var allErrors = this.localErrors
        .concat(this.englishErrors)
        .concat(this.tagErrors);
      var ok = allErrors.length == 0;
      return ok;
    },
    shouldShowEnglishInput() {
      return !String(this.value.Local).match(englishRegex);
    }
  },
  props: ["value", "vertical"]
};
</script>
