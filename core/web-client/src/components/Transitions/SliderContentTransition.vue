<template>
  <transition mode="out-in" name="slide-in-out" appear>
    <div :key="value">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SliderContentTransition",
  props: ["value"],
};
</script>

<style scoped lang="scss">
.slide-in-out-enter-active {
  animation: enter 1s ease-in-out;
}
.slide-in-out-leave-active {
  animation: enter 0.4s ease-in-out reverse;
}

@keyframes enter {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
