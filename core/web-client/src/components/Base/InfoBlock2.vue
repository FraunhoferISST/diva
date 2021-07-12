<template>
  <v-col
    cols="12"
    class="resource-main-meta-container d-flex justify-start align-center pa-0"
  >
    <!--<div class="resource-main-meta-icon pr-1" v-if="icon">
      <v-icon small color="info">
        {{icon}}
      </v-icon>
    </div>-->
    <div class="resource-main-meta-text">
      <slot></slot>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "InfoBlock2",
  components: {},
  props: ["icon"],
};
</script>

<style scoped lang="scss">
.resource-main-meta-container {
  height: 100%;
  border-right: 1px solid $bg_hover;
}
.resource-main-meta-icon {
  max-width: 50px;
}
.resource-main-meta-text {
  overflow: visible;
}
</style>
