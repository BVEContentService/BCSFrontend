<template>
  <div>
    <v-chip
      v-for="platform in platforms"
      :key="platform"
      :color="platformMap[platform].bgColor"
      :dark="platformMap[platform].dark"
      small
    >
      {{ platformMap[platform].name }}
    </v-chip>
    <v-chip v-if="!platforms || !platforms.length" small>
      {{ $t("t_pack_no_file") }}
    </v-chip>
  </div>
</template>

<script>
import mapping from "../config/mapping.js";
export default {
  name: "platform-chip",
  data: () => ({
    platformMap: mapping.platform
  }),
  props: ["platforms"]
};
</script>
