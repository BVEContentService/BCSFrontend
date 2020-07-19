<template>
  <v-container class="home-container">
    <v-row class="text-center">
      <v-col cols="12" class="construction">
        <div class="">
          <h1>Under Construction!</h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1>This is an about page</h1>
        <h2>BCSFrontend {{ version }}</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    }
  }
};
</script>
