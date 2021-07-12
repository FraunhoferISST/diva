<template>
  <aside id="navigation-main">
    <v-row class="fill-height" no-gutters align-content="space-between">
      <div style="width: 100%">
        <div class="navigation-item dotted-background"></div>

        <router-link to="/">
          <div class="diva-logo mb-5">
            <animated-diva-logo :animated="isLoading" />
          </div>
        </router-link>

        <router-link
          v-for="(link, i) in links"
          :key="i"
          :to="link.route"
          :title="link.text"
          class="navigation-item"
        >
          <v-icon small color="white">
            {{ link.icon }}
          </v-icon>
          <custom-progress-bar v-if="activeRoute.includes(link.route)" />
        </router-link>
      </div>

      <v-spacer />

      <div class="navigation-item mt-4 mb-4">
        <div class="">
          <user-controls
            :id="user.id"
            class="navigation-item user-item mt-4 mb-4"
            v-if="isLoggedIn"
          />
        </div>
      </div>
    </v-row>
  </aside>
</template>

<script>
import AnimatedDivaLogo from "@/components/Base/AnimatedDivaLogo";
import UserControls from "@/components/Navigation/UserControls";
import vars from "@/styles/vars.scss";
import CustomProgressBar from "@/components/Base/CustomProgressBar";

export default {
  name: "NavigationMain",
  components: { CustomProgressBar, UserControls, AnimatedDivaLogo },
  data: () => ({
    links: [
      {
        route: "/search",
        icon: "search",
        text: "Search",
      },
      {
        route: "/create",
        icon: "add",
        text: "New Resource",
      },
      {
        route: "/dashboard",
        icon: "dashboard",
        text: "Dashboard",
      },
    ],
    drawer: null,
  }),
  props: {
    source: String,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isLoggedIn() {
      return this.$store.state.user.isLoggedIn;
    },
    isLoading() {
      return this.$store.state.ui.route_loading;
    },
    mdUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
    activeRoute() {
      return this.$route.path;
    },
    vars() {
      return vars;
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
#navigation-main {
  position: fixed;
  left: 0;
  top: 0;
  width: 70px;
  height: 100vh;
  background-color: $bg_toolbar;
  //@include gradient-toolbar();
}

.navigation-item {
  position: relative;
  transition: 0.3s;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  //padding: 15px 25px;
  &:hover {
    background-color: $bg_toolbar_hover;
  }
  &.router-link-active {
    opacity: 1;
    background-color: $bg_toolbar_hover;
  }
}

.dotted-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 80px;
  @include bg-dotted();
}

.diva-logo {
  margin-left: 8px;
  margin-top: 12px;
  padding: 5px;
  width: 55px;
  height: 55px;
}

.user-item {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  padding: 5px;
  opacity: 1 !important;
  //border: 1px white dashed;
}
</style>
