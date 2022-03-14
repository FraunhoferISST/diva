<template>
  <nav id="navigation-main">
    <div id="navigation-main-items" class="d-flex justify-space-between">
      <div class="d-flex">
        <router-link to="/" style="width: 70px">
          <div class="diva-logo">
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
      <div>
        <div class="navigation-item">
          <user-controls
            :id="user.id"
            class="navigation-item user-item"
            v-if="isLoggedIn"
          />
        </div>
      </div>
    </div>
    <!--    <v-row class="fill-height" no-gutters align-content="space-between">
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
    </v-row>-->
  </nav>
</template>

<script>
import AnimatedDivaLogo from "@/components/Base/AnimatedDivaLogo";
import UserControls from "@/components/Navigation/UserControls";
import vars from "@/styles/vars.scss";
import CustomProgressBar from "@/components/Base/CustomProgressBar";

export default {
  name: "NavigationMain",
  components: {
    CustomProgressBar,
    UserControls,
    AnimatedDivaLogo,
  },
  data: () => ({
    userOverlay: false,
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
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: $bg_toolbar;
  z-index: 10;
}

#navigation-main-items {
  height: 100%;
  position: relative;
  z-index: 100;
  background-color: $bg_toolbar;
}

.navigation-item {
  position: relative;
  transition: 0.3s;
  width: 70px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  //opacity: 0.7;
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
  margin-left: 5px;
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
