<template>
  <div class="navigation-overlay-container">
    <slot v-if="open"> </slot>
  </div>
</template>

<script>
export default {
  name: "NavigationOverlay",
  props: {
    open: {
      type: Boolean,
      require: true,
    },
  },
  computed: {
    computedOpen: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("update:open", val);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.navigation-overlay-container {
  transition: 0.3s;
  position: fixed;
  bottom: 70px;
  left: 0;
  width: 100%;
  height: 50vh;
  min-height: 300px;
  background-color: white;
  z-index: 1;
}
</style>
