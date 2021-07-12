<template>
  <fade-in>
    <div v-if="isLoading" class="pb-container">
      <div class="pb-progress-container">
        <div class="pb-progress"></div>
      </div>
    </div>
  </fade-in>
</template>

<script>
import FadeIn from "../Transitions/FadeIn";
export default {
  name: "CustomProgressBar",
  components: { FadeIn },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isLoading() {
      return this.$store.state.ui.route_loading || this.loading;
    },
  },
};
</script>

<style scoped lang="scss">
.pb-container {
  height: 3px;
  width: 100%;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
}
.pb-progress-container {
  position: relative;
  width: auto;
  height: 100%;
  @include gradient-success(0.3, 0.3);
}
.pb-progress {
  height: 100%;
  position: absolute;
  width: 50%;
  border-radius: 2px;
  animation: progress-animation 1s linear infinite;
  @include gradient-success();
}

@keyframes progress-animation {
  0% {
    width: 0;
  }
  25% {
    width: 50%;
    left: 0;
  }
  50% {
    left: 50%;
  }

  100% {
    width: 0;
    left: 100%;
  }
}
</style>
