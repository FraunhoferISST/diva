<template>
  <div id="home">
    <div>
      <navigation-main />
    </div>
    <router-transition>
      <router-view></router-view>
    </router-transition>
  </div>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import NavigationMain from "@/components/Navigation/NavigationMain";

export default {
  name: "Home",
  components: { NavigationMain, RouterTransition },
};
</script>

<style scoped lang="scss">
#home {
  display: grid;
  grid-template-columns: 70px 1fr;
  height: 100%;
}
</style>
