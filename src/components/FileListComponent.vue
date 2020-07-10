<template>
  <v-form v-model="formValid" ref="editForm">
    <v-row>
      <v-col cols="12" sm="6" class="pb-0">
        <v-select
          v-model="file.Service"
          :label="this.$i18n.t('f_file_service')"
          :items="serviceItems"
          item-text="text"
          item-value="value"
          @input="nextTickValidate"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-text-field
          v-model="p1"
          :label="this.$i18n.t('f_file_p1_' + this.service.p1)"
          :rules="[
            this.service.p1v ||
              this.validatorMap[this.service.p1] ||
              (() => true),
            r_required,
            r_trim
          ]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="p21"
          v-if="service.p2.length > 0"
          :label="this.$i18n.t('f_file_p2_' + this.service.p2[0])"
          :rules="[
            this.validatorMap[this.service.p2[0]] || (() => true),
            r_required,
            r_trim
          ]"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="p22"
          v-if="service.p2.length > 1"
          :label="this.$i18n.t('f_file_p2_' + this.service.p2[1])"
          :rules="[
            this.validatorMap[this.service.p2[1]] || (() => true),
            r_required,
            r_trim
          ]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn color="error" large @click="removeFile" v-if="file.ID >= 1">
      <v-icon class="mr-3">mdi-delete</v-icon>
      {{ $t("l_file_remove") }}
    </v-btn>
    <v-btn
      color="success"
      large
      class="float-right"
      :disabled="!formValid"
      @click="submitForm"
    >
      <v-icon class="mr-3">mdi-content-save</v-icon>
      {{ file.ID >= 1 ? $t("l_file_change") : $t("l_file_create") }}
    </v-btn>
  </v-form>
</template>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
let urlRegex = /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
let Base64 = require("js-base64").Base64;
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
String.prototype.stripStart = function(s) {
  return this.replace(new RegExp("^" + escapeRegExp(s)), "");
};
String.prototype.stripEnd = function(s) {
  return this.replace(new RegExp(escapeRegExp(s) + "$"), "");
};
String.prototype.strip = function(s) {
  return this.replace(
    new RegExp("^" + escapeRegExp(s) + "|" + escapeRegExp(s) + "$", "g"),
    ""
  );
};
export default {
  name: "file-list-component",
  computed: {
    service: function() {
      return this.serviceMap[this.file.Service];
    },
    serviceItems: function() {
      let that = this;
      var si = Object.entries(this.serviceMap).map(function(v) {
        return { value: v[0], text: that.$i18n.t("f_file_s_" + v[0]) };
      });
      return si;
    },
    r_p1() {
      return (
        this.service.p1v || this.validatorMap[this.service.p1] || (() => true)
      );
    }
  },
  data: function() {
    let that = this;
    var googleSerializer = function(shareURL) {
      return shareURL
        .stripStart("https://")
        .stripStart("http://")
        .stripStart("drive.google.com/file/d")
        .stripStart("drive.google.com/open")
        .strip("/")
        .stripStart("?id=")
        .stripEnd("?usp=sharing")
        .strip("/")
        .stripEnd("view")
        .strip("/");
    };
    return {
      formValid: false,
      p1: "",
      p21: "",
      p22: "",
      serviceMap: {
        plain: { p1: "url", p2: [] },
        auth: { p1: "url", p2: ["username", "password"] },
        google: {
          p1: "share",
          p2: [],
          p1s: googleSerializer,
          p1d: sid => "https://drive.google.com/open?id=" + sid,
          p1v: sid =>
            googleSerializer(sid).match(/^[a-zA-Z0-9]*$/) ||
            that.$i18n.t("e_file_google_bad")
        },
        teracloud: {
          p1: "path",
          p2: ["email", "password"]
        },
        onedrive: {
          p1: "share",
          p2: [],
          p1v: path =>
            path.indexOf("https://1drv.ms") == 0 ||
            path.indexOf("http://1drv.ms") == 0 ||
            that.$i18n.t("e_file_onedrive_bad")
        },
        pandog: { p1: "path", p2: ["email", "password"] },
        bcstianjin: { p1: "path", p2: ["email"] }
      },
      validatorMap: {
        url: this.r_url,
        email: this.r_email,
        path: function(v) {
          return (
            (String(v) != "" && String(v)[0] == "/") ||
            that.$i18n.t("e_relative_path")
          );
        }
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.editForm.validate();
      if (!this.formValid) return;
      if (this.service.p1s) {
        this.file.URLParam = this.service.p1s(this.p1);
      } else {
        this.file.URLParam = this.p1;
      }
      if (this.service.p2.length == 2) {
        this.file.AuthParam = this.serializeBasicAuth(this.p21, this.p22);
      } else if (this.service.p2.length == 1) {
        this.file.AuthParam = this.p21;
      } else {
        this.file.AuthParam = "";
      }
      var that = this;
      if (this.file.ID < 1) {
        this.$http
          .put(this.$apiRootURL + "/files", this.file)
          .then(function(response) {
            that.createCallback(response.data);
            that.updateFieldFromModel(response.data);
            that.$dialog.message.success(that.$i18n.t("t_toast_created"), {
              position: "top-right"
            });
          })
          .catch(function(exception) {
            handleNetworkErr(exception, that);
          });
      } else {
        this.$http
          .post(this.$apiRootURL + "/files/" + this.file.ID, this.file)
          .then(function(response) {
            that.updateCallback(response.data);
            that.updateFieldFromModel(response.data);
            that.$dialog.message.success(that.$i18n.t("t_toast_saved"), {
              position: "top-right"
            });
          })
          .catch(function(exception) {
            handleNetworkErr(exception, that);
          });
      }
    },
    removeFile() {
      var that = this;
      if (this.file.ID >= 1) {
        this.$dialog
          .confirm({
            text: this.$i18n.t("t_remove_warn"),
            title: this.$i18n.t("t_remove_warn_title")
          })
          .then(res => {
            if (res) {
              that.$http
                .delete(that.$apiRootURL + "/files/" + that.file.ID)
                .then(function() {
                  that.removeCallback(that.file.ID);
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
    updateFieldFromModel(model) {
      var service = this.serviceMap[model.Service];
      if (service.p1d) {
        this.p1 = service.p1d(model.URLParam);
      } else {
        this.p1 = model.URLParam;
      }
      if (service.p2.length == 1) {
        this.p21 = model.AuthParam;
      } else if (service.p2.length == 2) {
        var cred = this.deserializeBasicAuth(model.AuthParam);
        this.p21 = cred[0];
        this.p22 = cred[1];
      }
    },
    nextTickValidate() {
      this.$nextTick(function() {
        this.$refs.editForm.validate();
      });
    },
    serializeBasicAuth(user, pass) {
      return Base64.encode(
        encodeURIComponent(user) + ":" + encodeURIComponent(pass)
      );
    },
    deserializeBasicAuth(token) {
      // The way the limit parameter of string.split works in JS is so damn bizzard
      var parts = Base64.decode(token)
        .split(":")
        .map(t => decodeURIComponent(t));
      return [parts.shift(), parts.join(":")];
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
    }
  },
  mounted() {
    this.updateFieldFromModel(this.file);
  },
  props: ["file", "createCallback", "updateCallback", "removeCallback"]
};
</script>
