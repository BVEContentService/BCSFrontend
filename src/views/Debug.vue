<template>
  <narrow-container>
    <h1>Error Tracing</h1>
    <div
      v-if="
        $store.state.errors.length + $store.state.backendExceptions.length > 0
      "
    >
      <h2 class="mb-2 red--text">
        Inform the developer about any error immediately!
      </h2>
      <v-btn color="info" @click="toggleShowURL()">Expand/Collapse</v-btn>
    </div>
    <p v-else>
      No error occured yet
    </p>
    <div v-if="$store.state.errors.length">
      <h2 class="mt-8 construction pl-4">Errors occured at Frontend</h2>
      <table cellspacing="0">
        <tr>
          <th>Error</th>
          <th>Line</th>
          <th>File</th>
        </tr>
        <tr v-for="(error, id) in $store.state.errors" :key="id">
          <td>{{ error.error }}</td>
          <td>{{ error.line }}</td>
          <td :class="showURL ? '' : 'debug-url-hide-overflow'">
            {{ error.url }}
          </td>
        </tr>
      </table>
    </div>

    <div v-if="$store.state.backendExceptions.length">
      <h2 class="mt-8 construction pl-4">
        Errors occured at Backend
      </h2>
      <table cellspacing="0">
        <tr>
          <th>Code</th>
          <th>Data</th>
          <th>Request</th>
        </tr>
        <tr v-for="(error, id) in $store.state.backendExceptions" :key="id">
          <td>{{ error.code }}</td>
          <td>{{ error.data }}</td>
          <td :class="showURL ? '' : 'debug-url-hide-overflow'">
            {{ error.request }}
          </td>
        </tr>
      </table>
    </div>
  </narrow-container>
</template>

<style scoped>
table {
  width: 100%;
  table-layout: fixed;
  border: 1px solid orange;
}
td,
th {
  font-weight: bold;
  word-break: break-all;
  border: 1px solid orange;
  padding: 4px 10px;
}
</style>

<style>
.debug-url-hide-overflow {
  white-space: nowrap;
  overflow: hidden;
}
</style>

<script>
export default {
  data: () => ({
    showURL: false
  }),
  methods: {
    toggleShowURL() {
      this.showURL = !this.showURL;
    }
  }
};
</script>
