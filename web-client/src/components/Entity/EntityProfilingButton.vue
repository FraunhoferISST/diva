<template>
  <div class="relative">
    <data-viewer :loading="loading" :error="error">
      <slot :profile="runProfiling">
        <v-btn
          :dark="!profilingInitiated"
          class="gprimary"
          v-if="profilingExists"
          :loading="profileLoading"
          :disabled="profilingInitiated"
          rounded
          @click="runProfiling"
        >
          {{
            profilingInitiated ? "profiling initiated" : "Initialize profiling"
          }}
        </v-btn>
      </slot>
    </data-viewer>
    <v-snackbar
      min-width="100px"
      width="280px"
      absolute
      rounded
      :timeout="10000"
      bottom
      text
      v-model="snackbar"
      :color="color"
      style="font-weight: bold"
    >
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script>
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { useUser } from "@/composables/user";
export default {
  name: "EntityProfilingButton",
  components: { DataViewer },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { request, loading, error } = useRequest();
    const {
      request: profileReq,
      loading: profileLoading,
      error: profileError,
    } = useRequest();
    const { snackbar, show, color, message } = useSnackbar();
    const { user } = useUser();
    return {
      request,
      loading,
      error,
      user,
      snackbar,
      show,
      color,
      message,
      profileError,
      profileLoading,
      profileReq,
    };
  },
  data: () => ({
    profilingInitiated: false,
    profilingExists: false,
  }),
  methods: {
    runProfiling() {
      return this.profileReq(
        this.$api.profiling.run({ entityId: this.id }).then(() => {
          this.profilingInitiated = true;
          this.show("Profiling initiated");
        })
      ).then(() => {
        if (this.profileError) {
          this.show(
            `${
              this.profileError?.response?.data?.message ??
              this.profileError.toString()
            }. Please try again later`,
            "error"
          );
        }
      });
    },
    checkProfiling() {
      this.loading = true;
      return this.request(
        this.$api.profiling
          .exists({ entityId: this.id })
          .then(() => (this.profilingExists = true))
          .catch((e) => {
            this.profilingExists = false;
            throw e;
          })
      );
    },
  },
};
</script>

<style scoped></style>
