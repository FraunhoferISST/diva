<template>
  <div class="navigation-overlay-container" :class="{ open: open }">
    <v-expand-transition>
      <div v-if="open" v-click-outside="() => open && close()">
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
  transition: 0.3s;
  position: fixed;
  bottom: 70px;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  &.open {
    border-top: 1px solid $bg_card_secondary;
  }
}
.navigation-overlay-content {
  background-color: white;
  height: 40vh;
  max-height: 40vh;
  overflow: auto;
  min-height: 200px;
}
@media screen and (max-width: 959px) {
  .navigation-overlay-container {
    bottom: 60px;
  }
  .navigation-overlay-content {
    height: 30vh;
    max-height: 30vh;
  }
}
</style>
