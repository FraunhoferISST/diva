<template>
  <fade-in>
    <div>
      <div v-for="(item, i) in searchResult" :key="i">
        <fade-in>
          <search-result-card class="d-block" :key="item.id" :data="item" />
        </fade-in>
      </div>
    </div>
  </fade-in>
</template>

<script>
import SearchResultCard from "@/components/Search/SearchResultCard";
import FadeIn from "@/components/Transitions/FadeIn";

export default {
  name: "SearchResult",
  components: { FadeIn, SearchResultCard },
  props: {
    searchResult: {
      type: Array,
      required: true,
    },
    list: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
