<template>
  <v-container class="mt-16" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4">
        <v-card class="elevation-4">
          <v-toolbar color="primary" dark flat dense>
            <v-toolbar-title>
              {{ sent ? $t("t_user_email_sent") : $t("t_user_register") }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="text-subtitle-1">
            <v-form v-if="!sent">
              <v-text-field
                v-bind:label="$t('f_user_email')"
                v-model="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="[r_required, r_email]"
              ></v-text-field>
            </v-form>
            <p
              v-else
              v-html="this.$i18n.t('t_user_email_sent_tip', { expiry: expiry })"
            ></p>
          </v-card-text>
          <v-card-actions v-if="!sent" class="pr-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              class="pr-4"
              @click="submitForm"
              :disabled="sending"
              :loading="sending"
            >
              <v-icon class="mr-4">mdi-pencil</v-icon>
              {{ $t("l_user_register") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export default {
  data: () => ({
    email: "",
    sending: false,
    sent: false,
    expiry: ""
  }),
  methods: {
    submitForm() {
      this.sending = true;
      this.$http
        .post(this.$apiRootURL + "/auth/register", {
          Email: this.email
        })
        .then(response => {
          this.sending = false;
          this.sent = true;
          this.expiry = response.data.Expiry;
        })
        .catch(exception => {
          this.sending = false;
          handleNetworkErr(exception, this);
        });
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_email(v) {
      return !v || !!String(v).match(emailRegex) || this.$i18n.t("e_email_bad");
    }
  }
};
</script>
