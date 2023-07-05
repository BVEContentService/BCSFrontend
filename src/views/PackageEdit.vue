<template>
  <narrow-container>
    <v-tabs>
      <edit-fab :to="detailURL" icon="mdi-eye" v-if="packID >= 1"></edit-fab>
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
            <a :href="documentURL('packfields')" target="_blank">
              {{ $t("f_pack_tip_manual") }}
            </a>
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
                <v-col cols="12" sm="6" class="pb-0 pt-0">
                  <v-checkbox
                    v-model="pack.ForcePopup"
                    :label="this.$i18n.t('f_force_popup')"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{
              $t("f_pack_thumbnail")
            }}</v-card-title>
            <v-card-text>
              <v-btn color="primarylight" class="mt-2" @click="hostImage">
                <v-icon class="mr-2">mdi-upload</v-icon>
                {{ $t("f_pack_thumbnail_host") }}
              </v-btn>
              <v-row class="mt-3">
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
        <html-editor :html.sync="pack.Description"></html-editor>
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
        <p class="mt-0 mb-4">
          <v-icon class="mr-2">mdi-information</v-icon>
          <a :href="documentURL('filefields')" target="_blank">
            {{ $t("f_pack_tip_manual") }}
          </a>
        </p>
        <file-list v-model="pack.Files" :newFilePackageID="pack.ID"></file-list>
      </v-tab-item>
    </v-tabs>
  </narrow-container>
</template>

<script>
import { uploadImage } from "../utils/ImgChr.js";
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { getExternalDocUrl } from "../utils/DocHelper.js";
// import { EventBus } from "../utils/EventBus.js";
function isURL(str) {
  var url = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+ ]*)*" + //port
    "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return str.length < 2083 && url.test(str);
}
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var packNameRegex = /^[a-zA-Z0-9- ]*$/;
var englishRegex = /^[\s\w\d\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*$/;
export default {
  data: () => ({
    networkBusy: false,
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
    },
    detailURL() {
      return "/package/detail/" + this.packID;
    }
  },
  methods: {
    submitForm() {
      this.$refs.editForm.validate();
      if (!this.formValid) return;
      if (!this.pack.Thumbnail) this.pack.ThumbnailLQ = "";
      if (String(this.pack.Name.Local).match(englishRegex))
        this.pack.Name.English = "";
      if (
        !!this.pack.Author.Name &&
        String(this.pack.Author.Name.Local).match(englishRegex)
      )
        this.pack.Author.Name.English = "";
      if (!this.isRepost) delete this.pack.Author;
      // Shrink request size by removing unnecessery fields
      delete this.pack.Description;
      delete this.pack.Uploader;
      delete this.pack.Files;
      if (this.packID < 1) {
        this.$http
          .put(this.$apiRootURL + "/packages", this.pack)
          .then(response => {
            this.$router.push("/package/edit/" + response.data.ID);
            this.$dialog.message.success(
              this.$i18n.t("t_toast_created_then_edit"),
              {
                position: "bottom-left"
              }
            );
          })
          .catch(exception => {
            handleNetworkErr(exception, this);
            this.ensureModelBind();
          });
      } else {
        this.$http
          .post(this.$apiRootURL + "/packages/" + this.packID, this.pack)
          .then(response => {
            if (response.data.ID != this.packID) {
              this.$router.push("/package/edit/" + response.data.ID);
            }
            this.pack = response.data;
            this.ensureModelBind();
            this.$dialog.message.success(this.$i18n.t("t_toast_saved"), {
              position: "bottom-left"
            });
          })
          .catch(exception => {
            handleNetworkErr(exception, this);
            this.ensureModelBind();
          });
      }
    },
    submitDescription() {
      var payload = { Description: this.pack.Description };
      if (this.packID >= 1) {
        this.$http
          .post(this.$apiRootURL + "/packages/" + this.packID, payload)
          .then(response => {
            this.pack = response.data;
            this.ensureModelBind();
            this.$dialog.message.success(this.$i18n.t("t_toast_saved"), {
              position: "bottom-left"
            });
          })
          .catch(exception => {
            handleNetworkErr(exception, this);
          });
      }
    },
    removePackage() {
      if (this.packID >= 1) {
        this.$dialog
          .confirm({
            text: this.$i18n.t("t_remove_warn"),
            title: this.$i18n.t("t_remove_warn_title")
          })
          .then(res => {
            if (res) {
              this.$http
                .delete(this.$apiRootURL + "/packages/" + this.packID)
                .then(() => {
                  this.$router.push("/package/list");
                  this.$dialog.message.warning(
                    this.$i18n.t("t_toast_removed"),
                    {
                      position: "bottom-left"
                    }
                  );
                })
                .catch(exception => {
                  handleNetworkErr(exception, this);
                });
            }
          });
      }
    },
    hostImage() {
      var fileSelector = document.createElement("input");
      fileSelector.type = "file";
      fileSelector.onchange = e => {
        var file = e.target.files[0];
        this.$dialog.message.warning(this.$i18n.t("t_toast_uploading"), {
          position: "bottom-left"
        });
        uploadImage(this, file)
          .then(result => {
            this.pack.Thumbnail = result.full_url;
            this.pack.ThumbnailLQ = result.thumb_url;
            this.$dialog.message.success(this.$i18n.t("t_toast_done"), {
              position: "bottom-left"
            });
          })
          .catch(ex => {
            handleNetworkErr(ex, this);
          });
      };
      fileSelector.click();
    },
    fetchPackage(paramID) {
      if (
        paramID &&
        paramID == parseInt(paramID, 10) &&
        parseInt(paramID, 10) != 0
      ) {
        // EventBus.$emit("setOverlay", "loading");
        this.$http
          .get(this.$apiRootURL + "/packages/" + paramID)
          .then(response => {
            this.pack = response.data;
            this.packID = response.data.ID;
            this.isRepost = !!response.data.Author;
            var isEditable =
              this.$store.state.profile &&
              (this.$store.state.profile.Privilege >= 50 ||
                this.$store.state.profile.ID == this.pack.UploaderID);
            if (!isEditable) {
              this.pack = null;
              this.packID = 0;
              this.isRepost = false;
              this.ensureModelBind();
              this.$router.push("/");
            } else {
              this.ensureModelBind();
              // EventBus.$emit("setOverlay", "");
            }
          })
          .catch(exception => {
            handleNetworkErr(exception, this, "overlay");
          });
      } else {
        this.pack = {};
        this.packID = 0;
        this.isRepost = false;
        this.ensureModelBind();
        var isEditable =
          this.$store.state.profile && this.$store.state.profile.Privilege >= 0;
        if (!isEditable) {
          this.$router.push("/");
        }
      }
    },
    ensureModelBind() {
      // Let the String3Inputs attach somewhere
      if (!this.pack.Name) this.$set(this.pack, "Name", {});
      if (!this.pack.Author) {
        this.$set(this.pack, "Author", {});
        this.$set(this.pack.Author, "Name", {});
      }
      // Get the watchers ready, or the text fields will not update when hosting an image
      if (!this.pack.Thumbnail) this.$set(this.pack, "Thumbnail", "");
      if (!this.pack.ThumbnailLQ) this.$set(this.pack, "ThumbnailLQ", "");
      if (!this.pack.Files) this.$set(this.pack, "Files", []);
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_email(v) {
      return !v || !!String(v).match(emailRegex) || this.$i18n.t("e_email_bad");
    },
    r_url(v) {
      return !v || isURL(String(v)) || this.$i18n.t("e_url_bad");
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
    },
    documentURL(topic) {
      return getExternalDocUrl(this, topic);
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
