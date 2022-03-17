import { ref } from "@vue/composition-api";
import api from "@/api/index";
import store from "@/store";
import kc from "@/api/keycloak";

export function useUser() {
  const loggedIn = ref(false);
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const load = (query = {}) => {
    loading.value = true;
    return api.users
      .getById(user.value.id, query)
      .then(({ data: response }) => (user.value = response))
      .catch((e) => (error.value = e))
      .finally(() => (loading.value = false));
  };
  const login = (user) => {
    return store.dispatch("login", user).catch(async (e) => {
      if (e?.response?.data?.code === 409) {
        const {
          data: { collection },
        } = await api.users.get({
          email: user.email,
        });
        const conflictingUser = collection[0];
        await api.users.delete(conflictingUser.id);
        return this.$store.dispatch("login", user).then(() => {
          loggedIn.value = true;
          user.value = store.state.user;
        });
      }
      error.value = e;
      throw e;
    });
  };
  const logout = () => {
    return store
      .dispatch("logout")
      .then(() => {
        kc.logout({
          redirectUri: `${window.location.origin}`,
        });
      })
      .then(() => {
        loggedIn.value = false;
        user.value = null;
      })
      .catch((e) => (error.value = e));
  };
  return {
    load,
    logout,
    login,
    loggedIn,
    loading,
    error,
  };
}
