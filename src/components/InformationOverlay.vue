<template>
  <v-container v-if="state != ''" class="mt-16" fluid>
    <v-row align="center" justify="center">
      <v-progress-circular
        v-if="state == 'loading'"
        indeterminate
        size="200"
        width="16"
        color="primary"
      >{{ $t("t_loading") }}</v-progress-circular>
      <v-col v-else cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4">
          <v-toolbar color="error" dark flat dense>
            <v-toolbar-title>
              <v-icon class="mr-4">mdi-alert-circle</v-icon>
              {{ $t("t_error_title") }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="text-subtitle-1" v-html="state"></v-card-text>
          <v-card-actions class="pr-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" class="pr-4 pl-2" @click="historyBack()">
              <v-icon class="mr-4">mdi-arrow-left</v-icon>
              {{ $t("t_back") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "information-overlay",
  props: ["state"],
  methods: {
    historyBack() {
      this.$router.go(-1);
    }
  }
};
</script>