<template>
  <narrow-container>
    <iframe :src="documentURL('about?do=export_xhtml&version=' + version)" />
  </narrow-container>
</template>

<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

<script>
import { getExternalDocUrl } from "../utils/DocHelper.js";
export default {
  computed: {
    version() {
      return (
        process.env.VUE_APP_VERSION +
        " @ " +
        document.documentElement.dataset.buildTimestampUtc.substring(0, 10)
      );
    }
  },
  methods: {
    documentURL(topic) {
      return getExternalDocUrl(this, topic);
    }
  }
};
</script>
