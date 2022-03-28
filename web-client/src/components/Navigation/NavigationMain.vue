<template>
  <nav id="navigation-main">
    <div id="navigation-main-items" class="d-flex justify-space-between">
      <div class="d-flex">
        <router-link to="/">
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
  margin: 10px 8px;
  padding: 8px;
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

@media screen and (max-width: 959px) {
  #navigation-main {
    height: 60px;
  }
  .navigation-item {
    width: 50px;
  }
  .diva-logo {
    width: 45px;
    height: 45px;
  }
  .user-item {
    width: 43px;
    height: 43px;
  }
}
</style>
