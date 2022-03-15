<template>
  <div class="relative">
    <data-fetcher :fetch-method="checkProfiling">
      <slot :profile="runProfiling">
        <v-btn
          :dark="!profilingInitiated"
          class="gprimary"
          v-if="profilingExists"
          :loading="loading"
          :disabled="profilingInitiated"
          rounded
          @click="runProfiling"
        >
          {{
            profilingInitiated ? "profiling initiated" : "Initialize profiling"
          }}
        </v-btn>
      </slot>
    </data-fetcher>
    <v-snackbar
      min-width="100px"
      width="280px"
      absolute
      rounded
      :timeout="10000"
      bottom
      text
      v-model="snackbar"
      :color="snackbarColor"
      style="font-weight: bold"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import DataFetcher from "@/components/DataFetchers/DataFetcher";
export default {
  name: "EntityProfilingButton",
  components: { DataFetcher },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "success",
    profilingInitiated: false,
    profilingExists: false,
  }),
  methods: {
    runProfiling() {
      this.loading = true;
      this.$api.profiling
        .run({ entityId: this.id })
        .then(() => {
          this.profilingInitiated = true;
          this.showSnackbar();
        })
        .catch((e) =>
          this.showSnackbar(
            `${
              e?.response?.data?.message ?? e.toString()
            }. Please try again later`,
            "error"
          )
        )
        .finally(() => (this.loading = false));
    },
    showSnackbar(msg = "Profiling successfully initiated", color = "success") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    checkProfiling() {
      this.loading = true;
      return this.$api.profiling
        .exists({ entityId: this.id })
        .then(() => (this.profilingExists = true))
        .catch(() => (this.profilingExists = false))
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped></style>
