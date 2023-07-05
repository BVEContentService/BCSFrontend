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
                <td class="pr-3">{{ $t("t_author") }}</td>
                <td class="pr-1 text-right">
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
                <td class="pr-3">
                  {{ !!pkg.Author ? $t("t_uploader") : $t("t_author") }}
                </td>
                <td class="pr-1 text-right">
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
      <v-row class="pl-4 pr-4 mt-2 mb-3">
        <div v-for="(item, i) in pkg.Files" :key="i">
          <v-btn
            large
            :color="platformMap[item.Platform].bgColor"
            :dark="platformMap[item.Platform].dark"
            :href="getFetchUrl(pkg, item)"
            target="_blank"
            class="mr-4"
          >
            <v-icon class="mr-3">mdi-download</v-icon>
            v{{ item.Version }} for {{ item.Platform }} ({{ item.Size }})
          </v-btn>
        </div>
      </v-row>
      <v-row class="pl-4 pr-4 mt-4 mb-4">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header class="pb-1 pt-1">
              <h2>{{ $t("t_pack_detail_info") }}</h2>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-html="obj2table(pkg)"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
      <v-divider class="mt-5 mb-3"></v-divider>
      <v-row class="pl-4 pr-4 mt-4">
        <div class="userDescription" v-html="pkg.Description"></div>
      </v-row>
    </narrow-container>
  </div>
</template>

<style>
.userDescription img {
  max-width: 80%;
  max-height: 100vh;
  position: relative;
  overflow: hidden;
}
</style>

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
import mapping from "../config/mapping.js";
import { s3 } from "../utils/String3Helper";
import { handleNetworkErr } from "../utils/ErrorHelper";
import { PlaceholderImage } from "../utils/DocHelper";
// import { EventBus } from "../utils/EventBus.js";
let Base64 = require("js-base64").Base64;
export default {
  data: () => ({
    pkg: { Name: {}, Uploader: { Name: {} }, Files: [] },
    platformMap: mapping.platform
  }),
  computed: {
    s3() {
      return string3 => s3(string3, this.$store.state.englishName);
    },
    thumbnailURL() {
      if (this.pkg.Thumbnail) {
        return this.pkg.Thumbnail;
      } else {
        return PlaceholderImage;
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
      // EventBus.$emit("setOverlay", "loading");
      var pkgid;
      if (paramID && paramID == parseInt(paramID, 10)) {
        pkgid = paramID;
      } else {
        this.$router.push("/");
        return;
      }
      this.$http
        .get(this.$apiRootURL + "/packages/" + pkgid)
        .then(responseB => {
          this.pkg = responseB.data;
          // EventBus.$emit("setOverlay", "");
        })
        .catch(exception => {
          handleNetworkErr(exception, this, "overlay");
        });
    },
    obj2table(obj) {
      if (!!obj.NeedValidation && !obj.Validated) {
        return "[ Validation Pending ]";
      }
      var result = "<table class='obj2table' cellspacing='0'>";
      Object.entries(obj).forEach(key => {
        if (
          key[0] != "Description" &&
          key[0] != "Files" &&
          key[1] != null &&
          key[1] != ""
        ) {
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
    },
    getFetchUrl(pack, file) {
      if (file.Platform == "hmmsim") {
        var tparam = Base64.encode("hm" + pack.ID);
        return (
          "https://api.zbx1425.cn/install/?t=" +
          tparam +
          "&l=" +
          this.$store.state.lang
        );
      } else {
        return file.FetchURL;
      }
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
