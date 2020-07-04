<template>
  <v-card width="50ch" max-width="100%" class="elevation-12">
    <v-toolbar color="primary" flat>
      <v-toolbar-title>{{ $t("t_login_title") }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          v-bind:label="$t('t_login_username')"
          name="login"
          v-model="username"
          prepend-icon="mdi-account"
          type="text"
        ></v-text-field>

        <v-text-field
          id="password"
          v-bind:label="$t('t_login_password')"
          v-model="password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
        ></v-text-field>
        <v-btn rounded block large @click="login()" :loading="querySent" :disabled="querySent">
          <v-icon class="mr-3">mdi-account</v-icon>Login
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { EventBus } from "../utils/EventBus.js";
import { handleNetworkErr } from "../utils/ErrorHelper.js";
export default {
  name: "login-dialog",
  props: ["reason"],
  data: () => ({
    username: "",
    password: "",
    querySent: false
  }),
  methods: {
    login: function() {
      var credentials = {
        username: this.username,
        password: this.password
      };
      if (credentials.username.trim() == "") return;
      this.querySent = true;
      var that = this;
      this.$http
        .post(this.$apiRootURL + "/auth/login", credentials)
        .then(function(responseA) {
          var uid = require("jsonwebtoken").decode(responseA.data.token).uid;
          that.$http
            .get(that.$apiRootURL + "/uploaders/" + uid)
            .then(function(responseB) {
              if (responseB.data.Description) delete responseB.data.Description;
              that.$store.commit("login", {
                token: responseA.data.token,
                profile: responseB.data
              });
              EventBus.$emit("setLoginDialog", false);
              if (that.reason == "badToken") {
                that.$dialog.message.warning(that.$i18n.t("t_toast_login_resubmit"), {
                  position: "top-right"
                });
              } else {
                that.$dialog.message.success(that.$i18n.t("t_toast_login"), {
                  position: "top-right"
                });
              }
              that.querySent = false;
            })
            .catch(function(exception) {
              that.querySent = false;
              handleNetworkErr(exception, that);
            });
        })
        .catch(function(exception) {
          that.querySent = false;
          handleNetworkErr(exception, that);
        });
    }
  }
};
</script>