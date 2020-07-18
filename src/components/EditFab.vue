<template>
  <v-btn rounded color="primary" class="editFab" :disabled="disabled" :to="to">
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<style scoped>
.editFab {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
}
</style>

<script>
export default {
  name: "edit-fab",
  props: ["disabled", "to"]
};
</script>
