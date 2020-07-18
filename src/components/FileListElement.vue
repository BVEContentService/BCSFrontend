<template>
  <v-form v-model="formValid" ref="editForm">
    <v-row v-if="!!file.Service">
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
      <v-col cols="12" sm="6" class="pb-0">
        <v-text-field
          v-model="file.Size"
          :label="this.$i18n.t('f_file_size')"
          :rules="[r_required, r_trim, r_filesize]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="!!file.Service">
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
    <v-row v-if="!!file.Service">
      <v-col cols="12" sm="6" class="pt-0 pb-0">
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
      <v-col cols="12" sm="6" class="pt-0 pb-0">
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
    <v-row>
      <v-col cols="12">
        <div class="mt-3">
          <v-btn
            color="error"
            large
            @click="removeFile"
            v-if="file.ID >= 1"
            :class="!!file.Service ? '' : 'ml-4 float-right'"
          >
            <v-icon class="mr-3">mdi-delete</v-icon>
            {{ $t("l_file_remove") }}
          </v-btn>
          <v-btn
            v-if="!!file.Service"
            color="success"
            large
            class="float-right"
            :disabled="!formValid"
            @click="submitForm"
          >
            <v-icon class="mr-3">mdi-content-save</v-icon>
            {{ file.ID >= 1 ? $t("l_file_change") : $t("l_file_create") }}
          </v-btn>
        </div>
        <div
          v-if="file.ID >= 1 && $store.state.profile.Privilege >= 10"
          class="mt-3"
        >
          <v-btn
            color="success"
            large
            @click="toggleFileValidation"
            v-if="!file.Validated"
          >
            <v-icon class="mr-3">mdi-check</v-icon>
            {{ $t("l_file_validation_do") }}
          </v-btn>
          <v-btn color="error" large @click="toggleFileValidation" v-else>
            <v-icon class="mr-3">mdi-close</v-icon>
            {{ $t("l_file_validation_undo") }}
          </v-btn>
          <v-btn
            class="float-right"
            large
            link
            :href="file.FetchURL"
            target="_blank"
          >
            <v-icon class="mr-3">mdi-download</v-icon>
            {{ $t("l_file_download") }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import mapping from "../config/mapping.js";
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
  name: "file-list-element",
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
    return {
      formValid: false,
      p1: "",
      p21: "",
      p22: "",
      serviceMap: mapping.file,
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
      if (
        this.file.ID >= 1 &&
        this.file.NeedValidation &&
        this.file.Validated
      ) {
        this.$dialog
          .confirm({
            text: this.$i18n.t("t_file_validation_warn")
          })
          .then(res => {
            if (res) {
              this.submitFile();
            }
          });
      } else {
        this.submitFile();
      }
    },
    submitFile() {
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
    toggleFileValidation() {
      var that = this;
      if (this.file.ID >= 1) {
        this.$http
          .post(this.$apiRootURL + "/files/" + this.file.ID, {
            Validated: !this.file.Validated
          })
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
    updateFieldFromModel(model) {
      if (!model.Service) return;
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
      return !v || isURL(String(v)) || this.$i18n.t("e_url_bad");
    },
    r_trim(v) {
      return String(v) == String(v).trim() || this.$i18n.t("e_str_trim");
    },
    r_filesize(v) {
      var parts = String(v).split(" ");
      var validUnits = ["B", "KB", "MB", "GB", "TB"];
      return (
        (parts.length == 2 &&
          !!parts[0].match(/^[0-9]*(.[0-9]*)?$/) &&
          validUnits.includes(parts[1])) ||
        this.$i18n.t("e_size_bad")
      );
    }
  },
  mounted() {
    this.updateFieldFromModel(this.file);
  },
  props: ["file", "createCallback", "updateCallback", "removeCallback"]
};
</script>
