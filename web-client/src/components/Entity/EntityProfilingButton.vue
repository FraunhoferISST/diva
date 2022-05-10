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
import { useApi } from "@/composables/api";
import { ref } from "@vue/composition-api";
export default {
  name: "EntityProfilingButton",
  components: { DataViewer },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const profilingInitiated = ref(false);
    const profilingExists = ref(false);
    const { request, loading, error } = useRequest();
    const { profiling } = useApi();
    const {
      request: profileReq,
      loading: profileLoading,
      error: profileError,
    } = useRequest();
    const { snackbar, show, color, message } = useSnackbar();
    const { user } = useUser();

    request(
      profiling
        .exists({ entityId: props.id })
        .then(() => (profilingExists.value = true))
        .catch(() => (profilingExists.value = false))
    );

    return {
      profilingInitiated,
      profilingExists,
      loading,
      error,
      user,
      snackbar,
      color,
      message,
      profileError,
      profileLoading,
      runProfiling: () =>
        profileReq(profiling.run({ entityId: props.id })).then(() => {
          if (profileError.value) {
            return show(
              `${
                profileError.value?.response?.data?.message ??
                profileError.value
              }. Please try again later`,
              { color: "error" }
            );
          }
          profilingInitiated.value = true;
        }),
    };
  },
};
</script>

<style scoped></style>
