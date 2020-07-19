<template>
  <v-container class="home-container">
    <v-row class="text-center">
      <v-col cols="12" class="construction">
        <div class="">
          <h1>Under Construction!</h1>
        </div>
      </v-col>
      <v-col cols="12">
        <h1>{{ $t("t_app_name") }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.home-container {
  padding-top: 0 !important;
}
.construction {
  text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
    2px 2px 0 #000;
  background-image: linear-gradient(
    45deg,
    black 25%,
    orange 25%,
    orange 50%,
    black 50%,
    black 75%,
    orange 75%,
    orange 100%
  );
  background-size: 84.85px 84.85px;
  background-repeat: repeat;
  color: white;
}
</style>

<script>
export default {
  name: "home",

  data: () => ({})
};
</script>
