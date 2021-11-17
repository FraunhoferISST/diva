<template>
  <v-col cols="12">
    <fade-in>
      <v-row>
        <v-col cols="12" v-for="(item, i) in searchResult" :key="i">
          <fade-in>
            <search-result-card class="fill-height" :key="i" :data="item" />
          </fade-in>
        </v-col>
      </v-row>
    </fade-in>
  </v-col>
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
