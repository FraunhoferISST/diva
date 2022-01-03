<template>
  <transition-group mode="out-in" name="slide-in-out" appear>
    <slot></slot>
  </transition-group>
</template>

<script>
export default {
  name: "FadeInGroup",
};
</script>

<style scoped lang="scss">
.slide-in-out-enter-active {
  animation: enter 0.2s linear;
}
.slide-in-out-leave-active {
  animation: leave 0.2s linear;
}
@keyframes enter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes leave {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
