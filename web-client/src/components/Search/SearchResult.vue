<template>
  <v-container fluid class="search-result-container pa-0 pb-12">
    <div v-for="(item, i) in items" :key="i">
      <search-result-card class="d-block" :key="item.id" :data="item" />
    </div>
  </v-container>
</template>

<script>
import SearchResultCard from "@/components/Search/SearchResultCard";

export default {
  name: "SearchResult",
  components: { SearchResultCard },
  props: {
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss">
.search-result-container {
  background-color: white;
}
</style>
