<template>
  <v-container class="mt-16" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4">
        <v-card class="elevation-4">
          <v-toolbar color="primary" dark flat dense>
            <v-toolbar-title>
              {{ sent ? $t("t_user_activated") : $t("t_user_activate") }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="text-subtitle-1">
            <v-form v-if="tokenValid === true" v-model="formValid">
              <p class="success-box">
                <v-icon color="success" class="mr-3">mdi-check-circle</v-icon>
                {{ $t("t_user_token_valid") }}
              </p>
              <p class="mb-1">
                {{ $t("f_user_account_info") }}
              </p>
              <v-divider></v-divider>
              <v-text-field
                v-bind:label="$t('f_user_idname')"
                v-model="request.Username"
                prepend-icon="mdi-account"
                :rules="[r_required, r_trim, r_idname, r_len(4)]"
                type="text"
              ></v-text-field>
              <v-text-field
                v-bind:label="$t('f_user_password')"
                v-model="request.Password"
                prepend-icon="mdi-lock"
                autocomplete="new-password"
                :rules="[r_required, r_trim, r_len(6)]"
                type="password"
              ></v-text-field>
              <v-text-field
                v-bind:label="$t('f_user_password_2')"
                prepend-icon="mdi-lock-plus"
                autocomplete="new-password"
                :rules="[r_required, r_trim, r_pass_2]"
                type="password"
              ></v-text-field>
              <p class="mb-1">
                {{ $t("f_user_name") }}
                <a
                  ><v-icon color="primary">mdi-help-circle</v-icon
                  >{{ $t("t_user_name_help") }}</a
                >
              </p>
              <v-divider></v-divider>
              <string-3-input
                v-model="request.Name"
                vertical="true"
                class="ml-5"
                :rule="[v => v.ok]"
              ></string-3-input>
            </v-form>
            <div v-else-if="tokenValid === false" class="text-center">
              <v-icon x-large color="error">mdi-alert-circle</v-icon>
              <h3 class="mt-2">{{ $t("e_user_token_expire") }}</h3>
            </div>
            <div v-else class="text-center mt-4 mb-4">
              <v-progress-circular
                indeterminate
                size="120"
                width="8"
                color="primary"
                >{{ $t("t_loading") }}</v-progress-circular
              >
            </div>
          </v-card-text>
          <v-card-actions v-if="tokenValid === true" class="pr-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              v-if="!sent"
              color="success"
              class="pr-4"
              @click="submitForm"
              :disabled="!formValid"
              :loading="sending"
            >
              <v-icon class="mr-4">mdi-pencil</v-icon>
              {{ $t("l_user_activate") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.success-box {
  color: green;
  border: 2px solid #4caf50;
  border-radius: 8px;
  padding: 4px 10px;
}
</style>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
var userNameRegex = /^[a-z][a-z0-9-_]*$/;
export default {
  data: function() {
    return {
      request: {
        Token: "",
        Name: {},
        Username: "",
        Password: ""
      },
      sending: false,
      sent: false,
      tokenValid: null,
      formValid: false
    };
  },
  methods: {
    submitForm() {
      if (!this.formValid) return;
      this.sending = true;
      this.$http
        .post(this.$apiRootURL + "/auth/activate", this.request)
        .then(responseA => {
          var credentials = {
            username: this.request.Username,
            password: this.request.Password
          };
          this.$http
            .post(this.$apiRootURL + "/auth/login", credentials)
            .then(responseB => {
              this.sending = false;
              this.sent = true;
              this.$store.commit("login", {
                token: responseB.data.token,
                profile: responseA.data
              });
              this.$router.push("/profile/edit/");
            })
            .catch(exception => {
              this.sending = false;
              handleNetworkErr(exception, this);
            });
        })
        .catch(exception => {
          this.sending = false;
          handleNetworkErr(exception, this);
        });
    },
    checkToken(token) {
      this.tokenValid = null;
      this.request.Token = this.$route.params.token;
      this.$http
        .post(this.$apiRootURL + "/auth/check_token", {
          Token: token
        })
        .then(() => {
          this.tokenValid = true;
        })
        .catch(exception => {
          if (exception.response && exception.response.data.ErrorCode == 214) {
            this.tokenValid = false;
          } else {
            handleNetworkErr(exception, this);
          }
        });
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_trim(v) {
      return String(v) == String(v).trim() || this.$i18n.t("e_str_trim");
    },
    r_idname(v) {
      return (
        !!String(v).match(userNameRegex) || this.$i18n.t("e_user_idname_limit")
      );
    },
    r_pass_2(v) {
      return v == this.request.Password || this.$i18n.t("e_user_password_diff");
    },
    r_len(len) {
      let vm = this;
      return function(v) {
        return String(v).length >= len || vm.$i18n.t("e_str_len", { len: len });
      };
    }
  },
  mounted() {
    this.checkToken(this.$route.params.token);
  },
  beforeRouteUpdate(to, from, next) {
    this.checkToken(to.params.token);
    next();
  }
};
</script>
