<template>
  <div class="d-inline-block">
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
import { useUser } from "@/composables/user";

export default {
  name: "logout-button",
  components: {},
  setup() {
    const { user, logout, loading } = useUser();
    return {
      user,
      logout,
      loading,
    };
  },
};
</script>
