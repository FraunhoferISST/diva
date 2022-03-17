<template>
  <div>
    <slot :logout="logout">
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
    </slot>
  </div>
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
        .finally(() => (this.loading = false));
    },
  },
};
</script>
