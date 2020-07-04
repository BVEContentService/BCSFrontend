<template>
  <v-container v-if="items && items.length">
    <v-row dense class="mb-3">
      <v-btn-toggle rounded v-model="itemsPerPage">
        <v-btn :value="5">5</v-btn>
        <v-btn :value="10">10</v-btn>
        <v-btn :value="114514">
          <v-icon>mdi-infinity</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-pagination v-model="page" :length="pagerLength" :page="page" :total-visible="8"></v-pagination>
    </v-row>
    <v-row dense>
      <v-col v-for="(item, i) in offsetItems" :key="i" cols="12">
        <component :is="tag" v-bind:item="item"></component>
      </v-col>
    </v-row>
    <v-row dense class="mt-3">
      <v-btn-toggle rounded v-model="itemsPerPage">
        <v-btn :value="5">5</v-btn>
        <v-btn :value="10">10</v-btn>
        <v-btn :value="114514">
          <v-icon>mdi-infinity</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-pagination v-model="page" :length="pagerLength" :page="page" :total-visible="8"></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "paginated-list",
  data: () => ({
    itemsPerPage: 10,
    page: 1
  }),
  computed: {
    pagerLength: function() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    offsetItems: function() {
      return this.items.slice(
        (this.page - 1) * this.itemsPerPage,
        this.page * this.itemsPerPage
      );
    }
  },
  props: ["items","tag"]
};
</script>