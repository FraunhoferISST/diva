<template>
  <data-viewer>
    <template #default="{ fetch, loading, error }">
      <slot
        :search="fetch"
        :loading="loading"
        :erro="error"
        :result="result"
      ></slot>
    </template>
  </data-viewer>
</template>
<script>
import DataViewer from "@/components/DataFetchers/DataViewer";
export default {
  name: "EntitiesSearch",
  components: { DataViewer },
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
