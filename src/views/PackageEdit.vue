<template>
  <v-container style="max-width:1280px">
    <v-tabs>
      <v-tab href="#tab-1">{{ $t("t_category_info") }}</v-tab>
      <v-tab href="#tab-2" v-if="packID >= 1">{{
        $t("t_category_description")
      }}</v-tab>
      <v-tab href="#tab-3" v-if="packID >= 1">{{
        $t("t_category_file")
      }}</v-tab>
      <v-tab-item value="tab-1">
        <v-form v-model="formValid" ref="editForm">
          <p class="mt-4 mb-0">
            <v-icon class="mr-2">mdi-information</v-icon>
            {{ $t("f_pack_tip_manual") }}
          </p>
          <p>
            <v-icon class="mr-2">mdi-information</v-icon>
            {{ $t("f_pack_tip_optional") }}
          </p>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_pack_ident") }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4" sm="6" class="pb-0 pt-0">
                  <v-text-field
                    v-model="pack.Identifier"
                    :disabled="!canModifyID"
                    :label="this.$i18n.t('f_ident_name')"
                    :rules="[r_required, r_trim, r_idname]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6" class="pb-0 pt-0">
                  <v-text-field
                    v-model="pack.GUID"
                    :label="this.$i18n.t('f_ident_guid')"
                    :rules="[r_guid]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_pack_name") }}</v-card-title>
            <v-card-text>
              <string-3-input
                v-model="pack.Name"
                :rule="[v => v.ok]"
              ></string-3-input>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_pack_origin") }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-radio-group
                    dense
                    row
                    v-model="isRepost"
                    class="mt-0"
                    :rules="[v => v === true || v === false || 'What the hell']"
                  >
                    <template v-slot:label>
                      <span style="color:red">{{
                        $t("t_pack_origin_question")
                      }}</span>
                    </template>
                    <v-radio
                      :value="false"
                      :label="this.$i18n.t('t_pack_origin_yes')"
                      color="green"
                    ></v-radio>
                    <v-radio
                      :value="true"
                      :label="this.$i18n.t('t_pack_origin_no')"
                      color="red"
                    ></v-radio>
                  </v-radio-group>
                  <h3 v-if="isRepost">{{ $t("t_pack_origin_tip") }}</h3>
                </v-col>
              </v-row>
              <template v-if="isRepost">
                <string-3-input
                  v-model="pack.Author.Name"
                  :rule="[v => v.ok]"
                ></string-3-input>
                <v-row>
                  <v-col cols="12" md="4" sm="6" class="pb-0 pt-0">
                    <v-text-field
                      v-model="pack.Author.Email"
                      :label="this.$i18n.t('f_email')"
                      :rules="[r_email]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6" class="pb-0 pt-0">
                    <v-text-field
                      v-model="pack.Author.Homepage"
                      :label="this.$i18n.t('f_homepage')"
                      :rules="[r_url]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_homepage") }}</v-card-title>
            <v-card-text>
              <h3 v-html="this.$i18n.t('f_pack_homepage_tip')"></h3>
              <v-row>
                <v-col cols="12" sm="6" class="pb-0 pt-0">
                  <v-text-field
                    v-model="pack.Homepage"
                    :label="this.$i18n.t('f_homepage')"
                    :rules="[r_url]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{
              $t("f_pack_thumbnail")
            }}</v-card-title>
            <v-card-text>
              <h3 v-html="this.$i18n.t('f_pack_thumbnail_tip')"></h3>
              <v-row>
                <v-col cols="12" sm="6" class="pb-0 pt-0">
                  <v-text-field
                    v-model="pack.Thumbnail"
                    :label="this.$i18n.t('f_thumbnail_url')"
                    :rules="[r_url]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="pb-0 pt-0">
                  <v-text-field
                    v-model="pack.ThumbnailLQ"
                    v-if="pack.Thumbnail"
                    :label="this.$i18n.t('f_thumbnail_lq_url')"
                    :rules="[r_url]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn
            color="error"
            class="mt-4"
            large
            @click="removePackage"
            v-if="packID >= 1"
          >
            <v-icon class="mr-3">mdi-delete</v-icon>
            {{ $t("l_pack_remove") }}
          </v-btn>
          <v-btn
            color="success"
            large
            class="mt-4 mb-10 float-right"
            :disabled="!formValid"
            @click="submitForm"
          >
            <v-icon class="mr-3">mdi-content-save</v-icon>
            {{ packID >= 1 ? $t("l_pack_change") : $t("l_pack_create") }}
          </v-btn>
        </v-form>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <codemirror
          v-model="pack.Description"
          :options="{
            mode: 'htmlmixed',
            tabSize: 2,
            viewportMargin: Infinity,
            lineNumbers: true,
            line: true,
            lineWrapping: true
          }"
          class="mt-4"
        ></codemirror>
        <v-btn
          color="success"
          large
          class="mt-4 mb-10 float-right"
          :disabled="!formValid"
          @click="submitDescription"
        >
          <v-icon class="mr-3">mdi-content-save</v-icon>
          {{ $t("l_pack_description") }}
        </v-btn>
      </v-tab-item>
      <v-tab-item value="tab-3" class="pt-4">
        <file-list v-model="pack"></file-list>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<style>
.v-tabs-items {
  height: 100% !important;
}
.CodeMirror {
  border: 1px solid #aaa;
  height: auto;
}
.CodeMirror-wrap pre {
  word-break: break-word;
}
</style>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { EventBus } from "../utils/EventBus.js";
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/htmlmixed/htmlmixed.js");
var urlRegex = /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var packNameRegex = /^[a-zA-Z0-9- ]*$/;
var englishRegex = /^[\s\w\d\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*$/;
export default {
  components: {
    codemirror
  },
  data: () => ({
    packID: 0,
    formValid: false,
    isRepost: false,
    pack: { Name: {}, Author: { Name: {} }, Description: "" }
  }),
  computed: {
    canModifyID() {
      return (
        this.packID < 1 ||
        (this.$store.state.profile && this.$store.state.profile.Privilege >= 50)
      );
    }
  },
  methods: {
    submitForm() {
      this.$refs.editForm.validate();
      if (!this.formValid) return;
      if (!this.pack.Thumbnail) delete this.pack.ThumbnailLQ;
      if (String(this.pack.Name.Local).match(englishRegex))
        this.pack.Name.English = "";
      if (String(this.pack.Author.Name.Local).match(englishRegex))
        this.pack.Author.Name.English = "";
      if (!this.isRepost) this.pack.Author = {};
      // Shrink request size by removing unnecessery fields
      delete this.pack.Description;
      delete this.pack.Uploader;
      delete this.pack.Files;
      var that = this;
      if (this.packID < 1) {
        this.$http
          .put(this.$apiRootURL + "/packages", this.pack)
          .then(function(responseA) {
            that.$router.push("/package/edit/" + responseA.data.ID);
            that.$store.commit("packListUpdate", that.pack);
            that.$dialog.message.success(
              that.$i18n.t("t_toast_created_then_edit"),
              {
                position: "top-right"
              }
            );
          })
          .catch(function(exception) {
            handleNetworkErr(exception, that);
          });
      } else {
        this.$http
          .post(this.$apiRootURL + "/packages/" + this.packID, this.pack)
          .then(function(responseA) {
            if (responseA.data.ID != that.packID) {
              that.$router.push("/package/edit/" + responseA.data.ID);
            }
            that.pack = responseA.data;
            that.ensureModelBind();
            that.$store.commit("packListUpdate", that.pack);
            that.$dialog.message.success(that.$i18n.t("t_toast_saved"), {
              position: "top-right"
            });
          })
          .catch(function(exception) {
            handleNetworkErr(exception, that);
          });
      }
    },
    submitDescription() {
      var payload = { Description: this.pack.Description };
      var that = this;
      if (this.packID >= 1) {
        this.$http
          .post(this.$apiRootURL + "/packages/" + this.packID, payload)
          .then(function(responseA) {
            that.pack = responseA.data;
            that.$store.commit("packListUpdate", that.pack);
            that.$dialog.message.success(that.$i18n.t("t_toast_saved"), {
              position: "top-right"
            });
          })
          .catch(function(exception) {
            handleNetworkErr(exception, that);
          });
      }
    },
    removePackage() {
      var that = this;
      if (this.packID >= 1) {
        this.$dialog
          .confirm({
            text: this.$i18n.t("t_remove_warn"),
            title: this.$i18n.t("t_remove_warn_title")
          })
          .then(res => {
            if (res) {
              that.$http
                .delete(that.$apiRootURL + "/packages/" + that.packID)
                .then(function() {
                  that.$store.commit("packListRemove", that.packID);
                  that.$router.push("/package/list");
                  that.$dialog.message.warning(
                    that.$i18n.t("t_toast_removed"),
                    {
                      position: "top-right"
                    }
                  );
                })
                .catch(function(exception) {
                  handleNetworkErr(exception, that);
                });
            }
          });
      }
    },
    fetchPackage(paramID) {
      if (paramID && paramID == parseInt(paramID, 10)) {
        EventBus.$emit("setOverlay", "loading");
        var that = this;
        this.$http
          .get(this.$apiRootURL + "/packages/" + paramID)
          .then(function(responseA) {
            that.pack = responseA.data;
            that.packID = responseA.data.ID;
            that.isRepost = !!responseA.data.Author;
            that.ensureModelBind();
            that.$store.commit("packListUpdate", that.pack);
            EventBus.$emit("setOverlay", "");
          })
          .catch(function(exception) {
            handleNetworkErr(exception, that, "overlay");
          });
      } else {
        this.pack = {};
        this.packID = 0;
        this.isRepost = false;
        this.ensureModelBind();
      }
    },
    ensureModelBind() {
      // Let the String3Inputs attach somewhere
      if (!this.pack.Name) this.$set(this.pack, "Name", {});
      if (!this.pack.Author) {
        this.$set(this.pack, "Author", {});
        this.$set(this.pack.Author, "Name", {});
      }
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_email(v) {
      return !v || !!String(v).match(emailRegex) || this.$i18n.t("e_email_bad");
    },
    r_url(v) {
      return !v || !!String(v).match(urlRegex) || this.$i18n.t("e_url_bad");
    },
    r_trim(v) {
      return String(v) == String(v).trim() || this.$i18n.t("e_str_trim");
    },
    r_idname(v) {
      if (!String(v).match(packNameRegex))
        return this.$i18n.t("e_pack_name_limit");
      if (String(v).indexOf("  ") > -1)
        return this.$i18n.t("e_pack_name_multiple_space");
      return true;
    },
    r_guid(v) {
      return (
        !v ||
        !!String(v)
          .toLowerCase()
          .trim()
          .replace(/-/g, "")
          .match(/^[0-9a-f]{32}$/) ||
        this.$i18n.t("e_pack_guid")
      );
    }
  },
  mounted() {
    this.fetchPackage(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchPackage(to.params.id);
    next();
  }
};
</script>
