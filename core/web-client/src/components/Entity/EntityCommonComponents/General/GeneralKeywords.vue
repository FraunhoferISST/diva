<template>
  <no-data-state v-if="!hasKeywords" text="You can provide keywords here">
  </no-data-state>
  <v-col cols="12" v-else>
    <v-chip
      class="ml-1 mt-1"
      small
      v-for="(word, i) in keywords"
      :key="word + '_' + i"
      >{{ word }}</v-chip
    >
  </v-col>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralKeywords",
  components: { NoDataState },
  props: {
    keywords: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasKeywords() {
      return this.keywords && this.keywords.length > 0;
    },
  },
};
</script>
