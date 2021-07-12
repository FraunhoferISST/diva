<template>
  <v-col cols="12">
    <fade-in>
      <v-row v-if="!list">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="4"
          xl="4"
          v-for="(item, i) in search_result"
          :key="i"
        >
          <fade-in>
            <search-result-card class="fill-height" :key="i" :data="item" />
          </fade-in>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col
          offset="0"
          offset-sm="0"
          offset-md="1"
          offset-lg="2"
          cols="12"
          sm="12"
          md="10"
          lg="8"
          xl="6"
        >
          <v-row>
            <v-col
              class="pa-0"
              cols="12"
              v-for="(list_item, i) in search_result"
              :key="i"
            >
              <fade-in>
                <search-result-list :data="list_item" />
              </fade-in>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </fade-in>
  </v-col>
</template>

<script>
import SearchResultList from "@/components/Search/SearchResultList";
import SearchResultCard from "@/components/Search/SearchResultCard";
import FadeIn from "@/components/Transitions/FadeIn";

export default {
  name: "SearchResult",
  components: { FadeIn, SearchResultCard, SearchResultList },
  props: {
    search_result: {
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
