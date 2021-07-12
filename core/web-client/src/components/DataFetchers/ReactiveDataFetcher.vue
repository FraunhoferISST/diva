<template>
  <data-fetcher ref="dataFetcher" :fetch-method="fetchMethod">
    <template #default="{ fetch, loading }">
      <slot :fetch="fetch" :loading="loading" />
    </template>
  </data-fetcher>
</template>

<script>
import EntityUpdateEvents from "@/components/Mixins/EntityUpdateEvents";
import DataFetcher from "@/components/DataFetchers/DataFetcher";

export default {
  name: "ReactiveDataFetcher",
  components: { DataFetcher },
  mixins: [EntityUpdateEvents],
  props: {
    fetchMethod: {
      type: Function,
      required: true,
    },
  },
  computed: {
    baseDataFetcher() {
      return this.$refs.dataFetcher?.baseDataFetcher;
    },
  },
  methods: {
    onUpdateEvent() {
      this.baseDataFetcher?.runFetchMethod();
    },
  },
};
</script>
<style scoped lang="scss">
.entity-data-fetcher-container {
  min-height: 200px;
}
</style>
