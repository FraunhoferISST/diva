<template>
  <div>
    <v-btn
      min-width="200px"
      outlined
      small
      color="primary"
      @click="send"
      :loading="loading"
      :disabled="profiled"
    >
      {{ profiled ? "Profiling started" : "Profile this resource" }}
    </v-btn>
    <v-snackbar class="gerror" v-model="snackbar" absolute>
      Could not profile resource. Please try again.
    </v-snackbar>
  </div>
</template>

<script>
import { profileResource } from "@/api/resources";
export default {
  name: "GeneralProfiling",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      loading: false,
      snackbar: false,
      profiled: false,
    };
  },
  methods: {
    async send() {
      this.snackbar = false;
      this.loading = true;
      try {
        await profileResource(this.id);
        this.profiled = true;
      } catch (e) {
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
