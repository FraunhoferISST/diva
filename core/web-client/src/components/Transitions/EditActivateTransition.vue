<template>
  <transition mode="out-in" name="slide-in-out" appear>
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "EditActivateTransition",
};
</script>

<style scoped lang="scss">
.slide-in-out-enter-active {
  animation: enter 0.3s linear;
}
.slide-in-out-leave-active {
  animation: leave 0.3s linear;
}
@keyframes enter {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes leave {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
}
</style>
