<template>
  <v-app app>
    <v-main>
      <div
        v-if="authenticating"
        class="fill-height d-flex align-center justify-center"
      >
        <div class="text-center">
          <div v-if="!error" style="height: 100px">
            <loading-state-overlay v-if="loading"> </loading-state-overlay>
            <p>{{ message }}</p>
          </div>
          <v-alert
            v-else
            key="alert"
            dense
            text
            color="error"
            class="text-center ma-0"
          >
            Ups, something went wrong with our authentication server. <br />
            {{ error }}<br />
            <v-btn
              class="mt-2"
              color="primary"
              rounded
              text
              small
              @click="authenticate"
            >
              Try again
            </v-btn>
          </v-alert>
        </div>
      </div>
      <router-transition v-else>
        <router-view></router-view>
      </router-transition>
    </v-main>
  </v-app>
</template>
<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import keycloak from "@/api/keycloak";
import LoadingStateOverlay from "@/components/Base/LoadingStateOverlay";
export default {
  name: "app",
  components: {
    LoadingStateOverlay,
    RouterTransition,
  },
  data: () => ({
    message: "Preparing the journey",
    loading: true,
    authenticating: true,
    error: "",
  }),
  computed: {},
  methods: {
    authenticate() {
      this.loading = true;
      this.error = "";
      this.authenticating = true;
      keycloak
        .init()
        .then((authenticated) => {
          console.log(authenticated);
          if (authenticated) {
            console.log(authenticated);
            const user = keycloak.getUser();
            this.$store.dispatch("login", user);
            this.message = `Hello ${user.username}`;
            setTimeout(() => {
              this.authenticating = false;
              this.$router.push({ name: "home" });
            }, 1000);
          } else {
            this.authenticating = false;
            this.$router.push({ name: "login" });
          }
        })
        .catch((e) => {
          this.error = e.error ?? "Failed to initialize authentication";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.authenticate();
  },
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
