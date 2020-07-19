<template>
  <narrow-container>
    <v-tabs>
      <v-tab href="#tab-1">{{ $t("t_category_info") }}</v-tab>
      <v-tab href="#tab-2">{{ $t("t_category_description") }}</v-tab>
      <v-tab-item value="tab-1">
        <v-form v-model="formValid" ref="editForm">
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_user_name") }}</v-card-title>
            <v-card-text>
              <string-3-input
                v-model="profile.Name"
                :rule="[v => v.ok]"
              ></string-3-input>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_homepage") }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4" sm="6" class="pb-0 pt-0">
                  <v-text-field
                    v-model="profile.Homepage"
                    :label="this.$i18n.t('f_homepage')"
                    :rules="[r_url]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{ $t("f_user_avatar") }}</v-card-title>
            <v-card-text>
              <p v-html="this.$i18n.t('f_user_avatar_tip')"></p>
              <v-btn
                large
                color="#1E8CBE"
                dark
                link
                href="https://www.gravatar.com"
                target="_blank"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFMklEQVR4Xu2aWchVVRTHf2ZlNhlGNhKVmQOmDxU9NtFDE9FkpRHmFJalVlQPBRVERfNIA02UFVoGkSUSaD4IYqmFNpiaNs/zTBN/WCfOd71nD2efe2+Xe9bLB9/de621/3vtvf5r7dOPHpd+Pb5+agDqCOhxBOoj0OMBUF+C9RGoj0CPI9DpI7ATsDXwO/BLJ/aiUwCMAa4DDgO2AX4DvgI2Aq8DS4HXDJiW4tIJAEbZAnf1rOxdYC7wmAHTEiA6AcBzwKkRq/kReBi4CfgsYl7Q0HYDMBB4D9g7yLu+gz4GLgeeKjG3cErVAAwFhgE/Ayvtb974zgbAkIRF3AVcCvyZoOO/qVUBMAC4HZgIaJcl2umLgYU5R3Xr6/+7Jzo/H5hgl2eSqioA6A88DZzRxBPd7rrp19hvVQEgdc8CZwJ/pyBQBQC3Apc4nLgfmN4CAKTyZrsXSmOQCsApgMLRJcrpRwQCoIjZBIyIWNFJwIsR4/sMTQFgMPBmwI3+fC7t+Y7A58BI4GgjSuIMPtkMjAW+9w1s9nsKADcAVwYYHQfMC4wAsUFlkh8AZYzbgMkBNq4Brg0Yt8WQsgDsCbxjTrrsisBMBf6JAEBp9Luc0huBKzyL+wYYbnQ6CoeyAMghOeaSlwGdz79yg3xHQBHQCICmPwGc47E3G7gjavVQqiOktCeSo4KmSL6wc9lIXcsCMAhYBezvsCmflHKj0mKZCBhtl59r7kXAPU2cLQuAVI0H5jgA0DGTb2/FREEZAKYBDziMfGLn8aeKAdjWCJWOSJGcDzzYagC0eIFQJPcBFxb8mBIBUum7EB/y+LaFW2Ui4BXgGAcApznIka8Y+touwW8L9B8HvOSwvQQ4qtURsNouuCI7B+e4f+OY7YD1DvKkS1M8oKg9plSnM75VgfG1gOxnadeLRWwEqH8nB4rOoajsQcCHDssiRacX/J5njc2G7AWsA3YomK+WmpjkH96V24BYAJQC304EQDxf9cFuDU6KBh9pBKvI/44DIMdSjkC2MHF80dfDLW8vM+6vPqBLBJ4isGjjWn4E5Nwi4FiHl+r3KZRDZHs7r7+GDAZO8FR+i62QClRXjgneC1zgsCACJCLUClH9f5lDcVvS4HnAIw4nPjIiVPVDh9puCv8DHLbbQoR0y8sRXYhFIqKk3ahSzgUedyhsGxXWBbTcCo8if9TCVrGkMrUK2QV4A9jXoUzF0qHtKIbkwwzgbs/K9KqjpmUVoqbrWR5F6kuqMx0lsTwgU65nLaUs3/OW6nPV6SmiRc3yKBB1Fkv8MtZQWQBk52rL3T6b2r2ZJZwTUboTONtnwNph4hXRkgKAChudy/0CrKpxeT3wDKC3PpfsaEfnqkDdH9h90/amqBZxPLAgAIBsyPtGZFS1qShS70+boI7PgdY+P9GT6hrNnQy8EOFDn6EpEZAp0qutHi3LSMYAs+e0WB16lHERI6++KgBQaapzrvZ3O0UPMrKZb7pG268CABkVS3vSUeZGO+aZoFpDPUKV30lSFQByQszwloCUleSw8Q/l/P/V83h+USIsKlr2SV1pw/yu+EAi83kPe82ZAiitpYi6y9knMp+mKGo2t8oj0Ey/+nuT7LJSmosRfUghOv0osCFmYszYVgOQ+aI0p+6PnskPsRce0WhdnhJdZuoIZ5/JvQqsAEIbJTFr7jO2XQA0OqjUqcZmBoA+lFSoB3dzS6+4YWKnAKjK/2Q9NQDJEHa5gjoCunwDk92vIyAZwi5XUEdAl29gsvt1BCRD2OUK/gUwye9B1jvfVAAAAABJRU5ErkJggg=="
                  class="iconfinder"
                />
                {{ $t("f_user_avatar_gravatar") }}
              </v-btn>
            </v-card-text>
          </v-card>
          <v-card class="mt-4">
            <v-card-title class="pb-0">{{
              $t("f_user_password")
            }}</v-card-title>
            <v-card-text>
              <v-btn large color="warning" dark link to="/user/change_password">
                <v-icon class="ml-2 mr-3">mdi-key</v-icon>
                {{ $t("t_user_change_password") }}
              </v-btn>
            </v-card-text>
          </v-card>
          <v-btn
            color="success"
            large
            class="mt-4 mb-10 float-right"
            :disabled="!formValid"
            @click="submitForm"
          >
            <v-icon class="mr-3">mdi-content-save</v-icon>
            {{ $t("l_user_change") }}
          </v-btn>
        </v-form>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <html-editor :html.sync="profile.Description"></html-editor>
        <v-btn
          color="success"
          large
          class="mt-4 mb-10 float-right"
          :disabled="!formValid"
          @click="submitDescription"
        >
          <v-icon class="mr-3">mdi-content-save</v-icon>
          {{ $t("l_user_description") }}
        </v-btn>
      </v-tab-item>
    </v-tabs>
  </narrow-container>
</template>

<style scoped>
.iconfinder {
  height: 3em;
  -webkit-filter: invert(100%);
  filter: invert(100%);
}
</style>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { EventBus } from "../utils/EventBus.js";
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
export default {
  data: () => ({
    formValid: false,
    profile: { Homepage: "", Name: {}, Description: "" }
  }),
  methods: {
    submitForm() {
      this.$refs.editForm.validate();
      if (!this.formValid) return;
      // Shrink request size by removing unnecessery fields
      delete this.profile.Description;
      delete this.profile.Packages;
      this.$http
        .post(this.$apiRootURL + "/uploaders/" + this.profile.ID, this.profile)
        .then(response => {
          this.profile = response.data;
          this.ensureModelBind();
          if (
            this.$store.state.profile &&
            this.$store.state.profile.ID == this.profile.ID
          ) {
            // Create a deep copy without the listeners.
            // Or the username in the sidebar will change when the fields are being edited.
            // It does feel funny, but it is not what I wanted.
            this.$store.commit(
              "profileUpdate",
              JSON.parse(JSON.stringify(this.profile))
            );
          }
          this.$dialog.message.success(this.$i18n.t("t_toast_saved"), {
            position: "top-right"
          });
        })
        .catch(exception => {
          handleNetworkErr(exception, this);
        });
    },
    submitDescription() {
      var payload = { Description: this.pack.Description };
      this.$http
        .post(this.$apiRootURL + "/uploaders/" + this.profile.ID, payload)
        .then(response => {
          this.profile = response.data;
          this.ensureModelBind();
          this.$dialog.message.success(this.$i18n.t("t_toast_saved"), {
            position: "top-right"
          });
        })
        .catch(exception => {
          handleNetworkErr(exception, this);
        });
    },
    fetchProfile(paramID) {
      EventBus.$emit("setOverlay", "loading");
      var uid;
      if (this.$store.state.profile) {
        if (paramID && paramID == parseInt(paramID, 10)) {
          uid = paramID;
        } else {
          uid = this.$store.state.profile.ID;
        }
      } else {
        this.$router.push("/");
        return;
      }
      if (
        uid != this.$store.state.profile.ID &&
        this.$store.state.profile.Privilege < 50
      ) {
        this.$router.push("/");
        return;
      }
      this.$http
        .get(this.$apiRootURL + "/uploaders/" + uid)
        .then(response => {
          this.profile = response.data;
          EventBus.$emit("setOverlay", "");
        })
        .catch(exception => {
          handleNetworkErr(exception, this, "overlay");
        });
    },
    ensureModelBind() {
      // Let the String3Inputs attach somewhere
      if (!this.profile.Name) this.$set(this.profile, "Name", {});
    },
    r_required(v) {
      return !!v || this.$i18n.t("e_required");
    },
    r_url(v) {
      return !v || isURL(String(v)) || this.$i18n.t("e_url_bad");
    },
    r_trim(v) {
      return String(v) == String(v).trim() || this.$i18n.t("e_str_trim");
    }
  },
  mounted() {
    this.fetchProfile(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchProfile(to.params.id);
    next();
  }
};
</script>
