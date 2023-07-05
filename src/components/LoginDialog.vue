<template>
  <v-card width="50ch" max-width="100%" class="elevation-12">
    <v-toolbar color="primary" flat dark>
      <v-toolbar-title>{{ $t("l_frame_login") }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <p class="ml-2 mt-4 mb-1">{{ $t("t_login_note_email") }}</p>
        <v-text-field
          v-bind:label="$t('f_user_email')"
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
        <v-btn
          rounded
          block
          large
          @click="login()"
          :loading="querySent"
          :disabled="querySent"
        >
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
      this.$http
        .post(this.$apiRootURL + "/auth/login", credentials)
        .then(responseA => {
          var uid = require("jsonwebtoken").decode(responseA.data.token).uid;
          this.$http
            .get(this.$apiRootURL + "/uploaders/" + uid)
            .then(responseB => {
              if (responseB.data.Description) delete responseB.data.Description;
              this.$store.commit("login", {
                token: responseA.data.token,
                profile: responseB.data
              });
              EventBus.$emit("setLoginDialog", false);
              if (this.reason == "badToken") {
                this.$dialog.message.warning(
                  this.$i18n.t("t_toast_login_resubmit"),
                  {
                    position: "bottom-left"
                  }
                );
              } else {
                this.$dialog.message.success(this.$i18n.t("t_toast_login"), {
                  position: "bottom-left"
                });
                EventBus.$emit("reloadSidebar");
              }
              this.querySent = false;
            })
            .catch(exception => {
              this.querySent = false;
              handleNetworkErr(exception, this);
            });
        })
        .catch(exception => {
          this.querySent = false;
          handleNetworkErr(exception, this);
        });
    }
  }
};
</script>
