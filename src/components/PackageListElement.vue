<template>
  <div style="position: relative">
    <edit-fab v-if="isEditable" :disabled="disabled" :to="editURL"></edit-fab>
    <v-card link :to="detailURL" :disabled="disabled">
      <div class="d-flex flex-no-wrap thumbnail-container">
        <img :src="thumbnailURL" class="thumbnail" />
        <div class="card-content">
          <v-card-title class="headline">{{ displayName }}</v-card-title>
          <v-card-subtitle class="pt-1 pb-2">
            <v-row>
              <v-col cols="12" md="6" lg="5" xl="4" class="card-col">
                <platform-chip :platforms="item.Platforms"></platform-chip>
              </v-col>
              <!--<v-col cols="12" md="6" lg="5" xl="4" class="card-col d-none d-md-block">
                <v-icon>mdi-information</v-icon>
                {{ item.Identifier }}
              </v-col>-->
            </v-row>
            <v-row>
              <v-col cols="12" md="6" lg="5" xl="4" class="card-col">
                <v-icon>mdi-calendar</v-icon>
                {{ zuluDate }}
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="5"
                xl="4"
                class="card-col d-none d-md-block"
              >
                <v-icon>mdi-information</v-icon>
                {{ item.Identifier }}
              </v-col>
            </v-row>
          </v-card-subtitle>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.thumbnail-container {
  position: relative;
}
.thumbnail {
  position: absolute;
  height: 100%;
  width: 200px;
  object-fit: cover;
}
.card-content {
  height: 100%;
  width: 100%;
  margin-left: 200px;
}
@media screen and (max-width: 500px) {
  .thumbnail {
    width: 100px;
  }
  .card-content {
    margin-left: 100px;
  }
}
.card-col {
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0.5em;
}
</style>

<script>
import { s3 } from "../utils/String3Helper";
export default {
  name: "package-list-element",
  props: ["item", "disabled"],
  computed: {
    displayName() {
      return s3(this.item.Name, this.$store.state.englishName);
    },
    isEditable() {
      return (
        this.$store.state.profile &&
        (this.$store.state.profile.Privilege >= 50 ||
          this.$store.state.profile.ID == this.item.UploaderID)
      );
    },
    zuluDate() {
      return new Date(this.item.UpdatedAt)
        .toISOString()
        .replace(".000Z", " UTC")
        .replace("T", " ");
    },
    detailURL() {
      return "/package/detail/" + this.item.ID;
    },
    editURL() {
      return "/package/edit/" + this.item.ID;
    },
    thumbnailURL() {
      if (this.item.ThumbnailLQ) {
        return this.item.ThumbnailLQ;
      } else if (this.item.Thumbnail) {
        return this.item.Thumbnail;
      } else {
        return require("../assets/landscape_placeholder.jpg");
      }
    }
  }
};
</script>
