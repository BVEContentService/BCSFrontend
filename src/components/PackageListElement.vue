<template>
  <div style="position: relative">
    <v-btn rounded color="primary" class="editFab" v-if="isEditable" :to="editURL">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-card link :to="detailURL">
      <div class="d-flex flex-no-wrap">
        <img :src="thumbnailURL" :height="125" :width="125/9*16" />
        <div>
          <v-card-title class="headline">{{ displayName }}</v-card-title>
          <v-card-subtitle class="pt-1">
            <v-icon>mdi-information</v-icon>
            {{ item.Identifier }}
            <br />
            <v-icon>mdi-calendar</v-icon>
            {{ zuluDate }}
          </v-card-subtitle>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.editFab {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
}
</style>

<script>
import { s3 } from "../utils/String3Helper";
export default {
  name: "package-list-element",
  props: ["item"],
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
      if (this.item.Thumbnail_LQ) {
        return this.item.Thumbnail_LQ;
      } else if (this.item.Thumbnail) {
        return this.item.Thumbnail;
      } else {
        return "https://via.placeholder.com/222x125?text=Placeholder";
      }
    }
  }
};
</script>