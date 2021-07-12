<template>
  <v-app app>
    <v-main>
      <router-transition>
        <router-view></router-view>
      </router-transition>
    </v-main>
  </v-app>
</template>
<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
export default {
  name: "app",
  components: {
    RouterTransition,
  },
  data() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Montserrat");
@import url("https://fonts.googleapis.com/css?family=Quicksand");

// Custom styles
@import "styles/table", "styles/inputs", "styles/buttons", "styles/snackbar",
  "styles/custom", "styles/expansionpanel", "styles/modal", "styles/alert",
  "styles/tabs";
html {
  font-size: 14px !important;
  overflow-y: auto;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  background: $bg_primary;
  font-family: Quicksand;
  color: $font_secondary_color;
  font-weight: bold;
  min-width: 768px;
}
body {
  font-family: $font_body;
  background: $bg_primary;
}

a {
  text-decoration: none;
}
.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.network {
  // @include gradient-primary(0.1, 0.1);
  @include border-radius;
}

.tui-editor-contents {
  font-family: Quicksand;
}

@media screen and (max-width: 959px) {
  #app {
    //padding-bottom: 50px;
  }
}
</style>
