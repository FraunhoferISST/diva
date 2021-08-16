<template>
  <section id="search" class="relative">
    <search-bar
      :input.sync="term"
      :loading="isLoading"
      :interacted="interacted"
      @submit="submitSearch"
    />
    <fade-in>
      <v-container
        class="ma-0"
        fluid
        v-if="searchResults.length > 0 && !isLoading"
      >
        <v-row>
          <search-result class="mt-5" :search_result="searchResults" />
        </v-row>
      </v-container>
      <v-container class="ma-0 fill-height" fluid v-else>
        <v-row>
          <v-col cols="12">
            <fade-in>
              <div class="text-center" v-if="interacted && !isLoading">
                <img
                  width="150"
                  :src="require('@/assets/illustrations/nodata.svg')"
                />
                <no-data-state
                  text="We could not find anything. Try something else"
                />
              </div>
            </fade-in>
          </v-col>
        </v-row>
      </v-container>
    </fade-in>
    <observer :id="term" @intersect="loadNextPage">
      <template #error>
        <v-alert dense text color="error">
          Some error occurred while loading data!
          <p class="text-center mb-0 mt-1">
            <v-btn x-small rounded color="primary" @click="loadNextPage">
              Try again
            </v-btn>
          </p>
        </v-alert>
      </template>
    </observer>
  </section>
</template>

<script>
import SearchResult from "@/components/Search/SearchResult";
import NoDataState from "@/components/Base/NoDataState";
import FadeIn from "@/components/Transitions/FadeIn";
import { Debouncer } from "@/utils";
import SearchBar from "@/components/Search/SearchBar";
const searchDebouncer = new Debouncer();
import Observer from "@/components/Base/Observer";

export default {
  components: {
    Observer,
    SearchBar,
    FadeIn,
    NoDataState,
    SearchResult,
  },
  name: "ResourceSearch",
  data() {
    return {
      interacted: false,
      isLoading: false,
      searchResults: [],
      cursor: null,
    };
  },
  watch: {
    term() {
      this.$router.replace({
        name: "search",
        query: { term: this.term },
      });
      this.cursor = null;
      this.debounceSearch();
    },
  },
  methods: {
    submitSearch() {
      this.cursor = null;
      this.debounceSearch();
    },
    debounceSearch() {
      searchDebouncer.debounce(this.search);
    },
    loadNextPage(observerState) {
      if (this.cursor) {
        observerState.loading = true;
        this.makeSearchRequest().then(({ items, cursor }) => {
          if (items.length > 0) {
            this.searchResults.push(...items);
            this.cursor = cursor;
            observerState.loading = false;
          } else {
            observerState.loading = false;
            observerState.completed = true;
          }
        });
      }
    },
    makeSearchRequest() {
      return this.$api
        .search(this.term.trim(), 45, this.cursor)
        .then(({ data }) => ({
          items: data.collection.filter(({ doc }) =>
            ["resource", "asset"].includes(doc.entityType)
          ),
          cursor: data.cursor,
        }))
        .finally(() => (this.isLoading = false));
    },
    async search() {
      if (!this.term.trim()) return;
      this.isLoading = true;
      this.interacted = true;
      const { items, cursor } = await this.makeSearchRequest();
      this.cursor = cursor;
      this.searchResults = items;
    },
  },
  computed: {
    term: {
      get() {
        return this.$store.state.search.term;
      },
      set(value) {
        this.$store.dispatch("setTerm", value);
      },
    },
  },
  mounted() {
    this.term = this.$route.query.term;
  },
};
</script>

<style lang="scss" scoped>
#search {
  padding-top: 80px;
}
</style>
