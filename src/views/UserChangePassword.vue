<template>
  <v-container class="mt-16" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4">
        <v-card class="elevation-4">
          <v-toolbar color="primary" dark flat dense>
            <v-toolbar-title>
              {{ $t("t_user_change_password") }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="text-subtitle-1">
            <v-form v-model="formValid">
              <v-text-field
                v-bind:label="$t('f_user_password_previous')"
                v-model="request.PreviousPassword"
                prepend-icon="mdi-key"
                autocomplete="new-password"
                :rules="[r_required, r_trim, r_len(6)]"
                type="password"
              ></v-text-field>
              <v-text-field
                v-bind:label="$t('f_user_password_new')"
                v-model="request.NewPassword"
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
            </v-form>
          </v-card-text>
          <v-card-actions class="pr-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              class="pr-4"
              @click="submitForm"
              :disabled="!formValid"
              :loading="sending"
            >
              <v-icon class="mr-4">mdi-pencil</v-icon>
              {{ $t("l_user_change_password") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
export default {
  data: function() {
    return {
      request: {
        PreviousPassword: "",
        NewPassword: ""
      },
      sending: false,
      sent: false,
      formValid: false
    };
  },
  methods: {
    submitForm() {
      if (!this.formValid) return;
      this.sending = true;
      this.$http
        .post(this.$apiRootURL + "/auth/change_password", this.request)
        .then(() => {
          this.$dialog.message.success(this.$i18n.t("t_toast_saved"), {
            position: "bottom-left"
          });
          this.$router.push("/profile/edit");
        })
        .catch(exception => {
          this.sending = false;
          handleNetworkErr(exception, this);
        });
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_trim(v) {
      return String(v) == String(v).trim() || this.$i18n.t("e_str_trim");
    },
    r_pass_2(v) {
      return (
        v == this.request.NewPassword || this.$i18n.t("e_user_password_diff")
      );
    },
    r_len(len) {
      let vm = this;
      return function(v) {
        return String(v).length >= len || vm.$i18n.t("e_str_len", { len: len });
      };
    }
  }
};
</script>
