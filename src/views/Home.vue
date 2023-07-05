<template>
  <narrow-container>
    <iframe :src="documentURL('start?do=export_xhtml')" />
  </narrow-container>
</template>

<style>
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
  name: "home",
  methods: {
    documentURL(topic) {
      return getExternalDocUrl(this, topic);
    }
  }
};
</script>
