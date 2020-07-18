<template>
  <v-list-item-group>
    <v-list-item
      :class="itemclass"
      v-for="item in items"
      :key="item.text"
      link
      :to="item.to"
      @click="
        () => {
          if (item.click) item.click();
        }
      "
    >
      <v-list-item-avatar v-if="avatar !== undefined">
        <v-icon style="background:white">{{ item.icon }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-action v-else>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</template>

<script>
export default {
  name: "list-item-group",
  props: ["items", "avatar", "itemclass"]
};
</script>
