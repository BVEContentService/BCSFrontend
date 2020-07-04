<template>
  <paginated-list tag="package-list-element" v-bind:items="packages"></paginated-list>
</template>

<script>
import { handleNetworkErr } from "../utils/ErrorHelper.js";
import { EventBus } from "../utils/EventBus.js";
export default {
  computed: {
    packages() {
      return this.$store.state.packageList;
    }
  },
  methods: {
    fetchPackages() {
      this.error = "";
      EventBus.$emit("setOverlay", "loading");
      var that = this;
      this.$http
        .get(this.$apiRootURL + "/packages")
        .then(function(responseB) {
          that.$store.commit("packListLoad", responseB.data);
          EventBus.$emit("setOverlay", "");
        })
        .catch(function(exception) {
          handleNetworkErr(exception, that, "overlay");
        });
    }
  },
  mounted() {
    if (!this.$store.state.packageList || !this.$store.state.packageList.length)
      this.fetchPackages();
  },
};
</script>