<template>
  <base-data-fetcher ref="baseDataFetcher" :fetch-method="fetchMethod">
    <template #default="{ loading, error, errorMessage, fetch }">
      <div class="data-fetcher-container full-width">
        <fade-in-group>
          <div style="height: 100px" key="overlay" v-if="loading">
            <loading-state-overlay />
          </div>
          <v-alert
            key="alert"
            v-else-if="error"
            dense
            text
            color="error"
            class="text-center ma-0"
          >
            <p class="text-center ma-0">
              {{ errorMessage || "Some error occurred while loading data" }}
            </p>
          </v-alert>
          <div key="slot" v-show="!loading && !error">
            <slot :fetch="fetch" :loading="loading"> </slot>
          </div>
        </fade-in-group>
      </div>
    </template>
  </base-data-fetcher>
</template>

<script>
import LoadingStateOverlay from "@/components/Base/LoadingStateOverlay";
import BaseDataFetcher from "@/components/DataFetchers/BaseDataFetcher";
import FadeInGroup from "@/components/Transitions/FadeInGroup";

export default {
  name: "DataFetcher",
  components: { FadeInGroup, BaseDataFetcher, LoadingStateOverlay },
  props: {
    fetchMethod: {
      type: Function,
      required: true,
    },
  },
  computed: {
    baseDataFetcher() {
      return this.$refs.baseDataFetcher;
    },
  },
};
</script>
<style scoped lang="scss"></style>
