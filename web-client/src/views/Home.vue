<template>
  <div id="home">
    <router-transition>
      <router-view></router-view>
    </router-transition>
    <navigation-main />
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
  grid-template-rows: 1fr 70px;
  height: 100%;
}
</style>
