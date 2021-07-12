<template>
  <transition name="router-animation" mode="out-in" appear>
    <slot> </slot>
  </transition>
</template>

<script>
export default {
  name: "RouterTransition",
};
</script>

<style scoped>
/deep/ .router-animation-enter-active {
  animation: enter 0.5s ease-in-out;
}
/deep/ .router-animation-leave-active {
  animation: leave 0.3s linear;
}
@keyframes enter {
  from {
    opacity: 0;
  }
  to {
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
