<template>
  <div>
    <div style="background:#525252">
      <narrow-container>
        <v-row align="end" style="position: relative">
          <v-col
            cols="12"
            sm="6"
            md="4"
            style="background: gray; position: relative; padding: 0"
          >
            <h1 style="position: absolute; top: 10px; left: 20px; color: white">
              {{ $t("t_loading") }}
            </h1>
            <a :href="thumbnailURL" target="_blank">
              <v-img
                class="z-index: 10"
                :aspect-ratio="16 / 9"
                :src="thumbnailURL"
              ></v-img>
            </a>
          </v-col>
          <v-col style="color:white;">
            <edit-fab v-if="isEditable" :to="editURL"></edit-fab>
            <h1>{{ s3(pkg.Name) }}</h1>
            <platform-chip
              class="mt-2 mb-3"
              :platforms="pkg.Platforms"
            ></platform-chip>
            <table>
              <tr v-if="pkg.Author">
                <td>{{ $t("t_author") }}</td>
                <td>
                  <a
                    v-if="pkg.Author.Email"
                    :href="'mailto:' + pkg.Author.Email"
                    ><v-icon color="primarylight">mdi-email-edit</v-icon></a
                  >
                  <a
                    v-if="pkg.Author.Homepage"
                    :href="pkg.Author.Homepage"
                    target="_blank"
                    ><v-icon color="primarylight">mdi-web</v-icon></a
                  >
                </td>
                <td>{{ s3(pkg.Author.Name) }}</td>
              </tr>
              <tr>
                <td>{{ !!pkg.Author ? $t("t_uploader") : $t("t_author") }}</td>
                <td>
                  <a
                    v-if="pkg.Uploader.Email"
                    :href="'mailto:' + pkg.Uploader.Email"
                    target="_blank"
                  >
                    <v-icon color="primarylight">mdi-email-edit</v-icon>
                  </a>
                  <a
                    v-if="pkg.Uploader.Homepage"
                    :href="pkg.Uploader.Homepage"
                    target="_blank"
                  >
                    <v-icon color="primarylight">mdi-web</v-icon>
                  </a>
                </td>
                <td>
                  <router-link
                    link
                    :to="'/profile/detail/' + pkg.Uploader.ID"
                    style="color: #ffa726"
                    >{{ s3(pkg.Uploader.Name) }}</router-link
                  >
                </td>
              </tr>
            </table>
          </v-col>
        </v-row>
      </narrow-container>
    </div>
    <narrow-container>
      <v-row class="pl-4 pr-4 mt-2">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header color="primarylight"
              >(Temporary) Detail Info Display
            </v-expansion-panel-header>
            <v-expansion-panel-content
              ><p class="mt-2">
                This is ugly. Will try to make it prettier later.
              </p>
              <div v-html="obj2table(pkg)"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
      <v-row class="pl-4 pr-4 mt-4"><div v-html="pkg.Description"></div></v-row>
    </narrow-container>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
<style>
.obj2table td:first-child {
  padding-right: 10px;
}
.obj2table {
  margin: -3px -6px;
  border: 1px solid #bbb;
}
.obj2table td {
  padding: 1px 4px;
  border: 1px solid #bbb;
}
</style>

<script>
import { s3 } from "../utils/String3Helper";
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { EventBus } from "../utils/EventBus.js";
export default {
  data: () => ({
    pkg: { Name: {}, Uploader: { Name: {} } }
  }),
  computed: {
    s3() {
      return string3 => s3(string3, this.$store.state.englishName);
    },
    thumbnailURL() {
      if (this.pkg.Thumbnail) {
        return this.pkg.Thumbnail;
      } else {
        return require("../assets/landscape_placeholder.jpg");
      }
    },
    isEditable() {
      return (
        this.$store.state.profile &&
        (this.$store.state.profile.Privilege >= 50 ||
          this.$store.state.profile.ID == this.pkg.UploaderID)
      );
    },
    editURL() {
      return "/package/edit/" + this.pkg.ID;
    }
  },
  methods: {
    fetchpkg(paramID) {
      EventBus.$emit("setOverlay", "loading");
      var pkgid;
      if (paramID && paramID == parseInt(paramID, 10)) {
        pkgid = paramID;
      } else {
        this.$router.push("/");
        return;
      }
      var vm = this;
      this.$http
        .get(this.$apiRootURL + "/packages/" + pkgid)
        .then(function(responseB) {
          vm.pkg = responseB.data;
          EventBus.$emit("setOverlay", "");
        })
        .catch(function(exception) {
          handleNetworkErr(exception, vm, "overlay");
        });
    },
    obj2table(obj) {
      if (!!obj.NeedValidation && !obj.Validated) {
        return "[ Validation Pending ]";
      }
      var result = "<table class='obj2table' cellspacing='0'>";
      Object.entries(obj).forEach(key => {
        if (key[0] != "Description" && key[1] != null && key[1] != "") {
          result += "<tr><td>" + key[0] + "</td><td>";
          if (key[1] instanceof Object) {
            result += this.obj2table(key[1]);
          } else if (
            String(key[1]).startsWith("http://") ||
            String(key[1]).startsWith("https://")
          ) {
            result +=
              "<a href='" + key[1] + "' target='_blank'>" + key[1] + "</a>";
          } else if (key[0] == "Email") {
            result +=
              "<a href='mailto:" +
              key[1] +
              "' target='_blank'>" +
              key[1] +
              "</a>";
          } else {
            result += key[1];
          }
          result += "</td></tr>";
        }
      });
      result += "</table>";
      return result;
    }
  },
  mounted() {
    this.fetchpkg(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchpkg(to.params.id);
    next();
  }
};
</script>
