<template>
  <v-btn
    color="error"
    rounded
    text
    :loading="loading"
    :disabled="loading"
    @click.native="logout"
    v-bind="$attrs"
  >
    Logout
  </v-btn>
</template>

<script>
import keycloak from "@/api/keycloak";
export default {
  name: "logout-button",
  components: {},
  data: () => ({
    loading: false,
  }),
  methods: {
    logout() {
      this.loading = true;
      this.$store
        .dispatch("logout")
        .then(() => {
          keycloak.logout({
            redirectUri: `${window.location.origin}`,
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
