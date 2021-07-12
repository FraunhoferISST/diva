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
          this.loading = false;
          this.$router.push("/login");
          return this.$nextTick();
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
