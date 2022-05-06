<template>
  <v-container fluid class="search-result-container pl-0 pr-0 pt-0">
    <search-result-card
      class="d-block"
      v-for="(item, i) in items"
      :key="i"
      :data="item"
    />
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
  padding-bottom: 100px;
}
</style>
