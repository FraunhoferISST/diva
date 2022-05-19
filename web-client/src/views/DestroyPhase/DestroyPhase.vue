<template>
  <router-transition>
    <router-view></router-view>
  </router-transition>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
export default {
  name: "DestroyPhase",
  components: {
    RouterTransition,
  },
};
</script>

<style scoped></style>
