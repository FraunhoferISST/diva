<template>
  <base-data-fetcher :fetch-method="search">
    <template #default="{ fetch, loading, error }">
      <slot
        :search="fetch"
        :loading="loading"
        :erro="error"
        :result="result"
      ></slot>
    </template>
  </base-data-fetcher>
</template>
<script>
import BaseDataFetcher from "@/components/DataFetchers/BaseDataFetcher";
export default {
  name: "EntitiesSearch",
  components: { BaseDataFetcher },
  props: {
    resultFormatter: {
      type: Function,
      default: (result) => result.data,
    },
  },
  data: () => ({
    result: [],
  }),
  methods: {
    async search(term, pageSize, cursor) {
      if (term) {
        return this.$api
          .search(term, pageSize, cursor)
          .then((response) => (this.result = this.resultFormatter(response)));
      }
    },
  },
};
</script>

<style scoped></style>
