<template>
  <v-container class="resource-views-container ma-0" fluid>
    <slot name="content"></slot>
  </v-container>
</template>

<script>
export default {
  name: "ViewsContainer",
};
</script>

<style scoped>
.resource-views-container {
  width: 100%;
}
</style>
