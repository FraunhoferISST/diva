<template>
  <div id="home">
    <div
      v-if="loading || error"
      class="fill-height d-flex align-center justify-center"
    >
      <div class="text-center">
        <div v-if="!error" style="height: 100px">
          <loading-state-overlay> </loading-state-overlay>
          <p>Logging in {{ user.username }}...</p>
        </div>
        <v-alert
          v-else
          key="alert"
          dense
          text
          color="error"
          class="text-center ma-0"
        >
          Something went wrong with our log in service. <br />
          {{ errorMessage }}<br />
          <logout-button small class="mt-2 mr-3" />
          <v-btn
            to="/login"
            class="mr-3"
            color="primary"
            rounded
            text
            small
            @click="loginUser"
          >
            Go to login
          </v-btn>
          <v-btn color="primary" rounded text small @click="loginUser">
            Try again
          </v-btn>
        </v-alert>
      </div>
    </div>
    <router-transition v-else>
      <router-view :key="$route.params.id"></router-view>
    </router-transition>
    <navigation-main v-if="!loading && !error" />
  </div>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import NavigationMain from "@/components/Navigation/NavigationMain";
import { useUser } from "@/composables/user";
import keycloak from "@/api/keycloak";
import LoadingStateOverlay from "@/components/Base/LoadingStateOverlay";
import { computed, ref } from "@vue/composition-api";
import LogoutButton from "@/components/Navigation/LogoutButton";

export default {
  name: "Home",
  components: {
    LogoutButton,
    LoadingStateOverlay,
    NavigationMain,
    RouterTransition,
  },
  setup() {
    const loading = ref(true);
    const { login, error } = useUser();
    const user = keycloak.getUser();
    login(user).then(() => (loading.value = false));
    return {
      loading,
      error,
      user,
      loginUser: () => {
        loading.value = true;
        return login(user).then(() => (loading.value = false));
      },
      errorMessage: computed(
        () => error.value?.response?.data?.message ?? error.value
      ),
    };
  },
};
</script>

<style scoped lang="scss">
#home {
  display: grid;
  grid-template-rows: 1fr 70px;
  height: 100%;
}
</style>
