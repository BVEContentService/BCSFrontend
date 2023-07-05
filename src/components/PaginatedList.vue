<template>
  <v-container>
    <v-row v-if="totalLength > 0" dense class="mb-3">
      <!--<v-btn-toggle rounded v-model="itemsPerPage" mandatory>
        <v-btn :value="5" :disabled="disabled">5</v-btn>
        <v-btn :value="10" :disabled="disabled">10</v-btn>
        <v-btn :value="20" :disabled="disabled">20</v-btn>
      </v-btn-toggle>-->
      <v-pagination
        v-model="page"
        :length="pagerLength"
        :page="page"
        :total-visible="8"
        :disabled="disabled"
      ></v-pagination>
    </v-row>
    <v-row dense>
      <slot></slot>
      <v-col v-if="totalLength == 0">
        <slot name="empty">
          <v-icon large class="mr-4 ml-3">mdi-alert-circle</v-icon>
          <span>{{ $t("t_filter_empty") }}</span>
        </slot>
      </v-col>
      <template v-if="items && items.length">
        <v-col v-for="(item, i) in items" :key="i" cols="12">
          <component
            :is="tag"
            v-bind:item="item"
            v-bind:disabled="disabled"
          ></component>
        </v-col>
      </template>
    </v-row>
    <v-row v-if="totalLength > 0" dense class="mt-3">
      <!--<v-btn-toggle rounded v-model="itemsPerPage" mandatory>
        <v-btn :value="5" :disabled="disabled">5</v-btn>
        <v-btn :value="10" :disabled="disabled">10</v-btn>
        <v-btn :value="20" :disabled="disabled">20</v-btn>
      </v-btn-toggle>-->
      <v-pagination
        v-model="page"
        :length="pagerLength"
        :page="page"
        :total-visible="8"
        :disabled="disabled"
      ></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "paginated-list",
  computed: {
    pagerLength() {
      return Math.ceil(this.totalLength / this.itemsPerPage);
    }
  },
  data: () => ({
    itemsPerPage: 20,
    page: 1
  }),
  watch: {
    itemsPerPage(newIPP, oldIPP) {
      var pageTopIndex = oldIPP * (this.page - 1);
      var previousPage = this.page;
      this.page = Math.floor(pageTopIndex / newIPP) + 1;
      // Otherwise let the watcher of page do this
      if (this.page == previousPage) this.onUpdatePaginator(newIPP, this.page);
    },
    page(newPG) {
      this.onUpdatePaginator(this.itemsPerPage, newPG);
    }
  },
  methods: {
    onUpdatePaginator(IPP, PG) {
      this.switchCallback(IPP * (PG - 1), IPP * PG - 1);
    }
  },
  props: ["items", "tag", "disabled", "totalLength", "switchCallback"]
};
</script>
