<template>
  <div class="navigation-overlay-container">
    <v-expand-transition>
      <div v-if="open">
        <div class="d-flex justify-end pa-4">
          <v-btn color="red" icon @click="close">
            <v-icon color="red"> close </v-icon>
          </v-btn>
        </div>
        <div class="navigation-overlay-content">
          <slot> </slot>
        </div>
      </div>
    </v-expand-transition>
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
  methods: {
    close() {
      this.computedOpen = false;
    },
  },
};
</script>

<style scoped lang="scss">
.navigation-overlay-container {
  border-top: 1px solid $bg_card_secondary;
  transition: 0.3s;
  position: fixed;
  bottom: 70px;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
.navigation-overlay-content {
  background-color: white;
  height: 40vh;
  max-height: 40vh;
  overflow: auto;
}
</style>
