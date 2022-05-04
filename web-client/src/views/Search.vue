<template>
  <section id="search" class="relative" v-scroll.self="onScroll">
    <v-container fluid class="pa-0 relative">
      <search-bar
        :input.sync="term"
        :loading="loading"
        :total="total"
        @input="loadFirstSearchPage"
      />
      <div class="search-container">
        <search-facets :facets.sync="facets" />
        <search-result :items="items" />
      </div>
      <observer
        v-if="items.length > 0 && !loading"
        style="height: 1px"
        @intersect="loadNextPage"
      >
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
        <template #completed>
          <p class="text-center py-10">All results loaded</p>
        </template>
      </observer>
    </v-container>
  </section>
</template>

<script>
import SearchResult from "@/components/Search/SearchResult";
import SearchBar from "@/components/Search/SearchBar";
import Observer from "@/components/Base/Observer";
import { useSearch } from "@/composables/search";
import { computed, ref } from "@vue/composition-api";
import SearchFacets from "@/components/Search/SearchFactes";

export default {
  components: {
    SearchFacets,
    Observer,
    SearchBar,
    SearchResult,
  },
  name: "Search",
  setup() {
    const facets = ref([]);
    const items = ref([]);
    const pageSize = ref(30);
    const { search, data, loading, error, cursor, total } = useSearch();
    return {
      pageSize,
      loading,
      error,
      cursor,
      data,
      total,
      items,
      facets,
      searchResult: computed(() => data.value?.collection ?? []),
      searchEntities: (input) =>
        search(input, {
          pageSize: pageSize.value,
          ...Object.fromEntries(
            facets.value
              .filter(({ selected }) => selected.length > 0)
              .map(({ type, selected }) => [
                type,
                selected.map(({ key }) => key).join(","),
              ])
          ),
        }),
    };
  },
  data: () => ({
    interacted: false,
    offsetTop: 0,
  }),
  watch: {
    facets: {
      handler() {
        this.loadFirstSearchPage(this.term, this.facets);
        this.setRouteParams(this.term, this.facets);
      },
      deep: true,
    },
    term() {
      this.setRouteParams(this.term, this.facets);
      this.interacted = true;
    },
  },
  computed: {
    emptyResultText() {
      const baseText = "We could not find anything.";
      const reasonText = this.term
        ? "Try something else"
        : "It seem that you do not have any data in your catalog. Start now and import your data";
      return `${baseText} ${reasonText}`;
    },
    term: {
      get() {
        return this.$store.state.search.term;
      },
      set(value) {
        this.$store.dispatch("setTerm", value);
      },
    },
  },
  methods: {
    setRouteParams(input, facets = []) {
      this.$router.replace({
        name: "search",
        query: {
          term: this.term,
          ...Object.fromEntries(
            facets
              .filter(({ selected }) => selected.length > 0)
              .map(({ type, selected }) => [
                type,
                selected.map(({ key }) => key).join(","),
              ])
          ),
        },
      });
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
      if (e.target.scrollTop > 220) {
        this.interacted = true;
      }
    },
    loadNextPage(observerState) {
      if (this.cursor) {
        observerState.loading = true;
        this.loadSearchPage().then(() => {
          observerState.loading = false;
          if (!this.cursor) {
            observerState.completed = true;
          }
        });
      }
    },
    loadFirstSearchPage(facets = []) {
      this.cursor = null;
      return this.searchEntities(this.term.trim(), facets).then(
        () => (this.items = this.searchResult)
      );
    },
    loadSearchPage() {
      return this.searchEntities(this.term.trim(), this.facets).then(() =>
        this.items.push(...this.searchResult)
      );
    },
  },
  mounted() {
    if (this.$route.query.term) {
      this.term = this.$route.query.term;
      this.interacted = true;
      return this.loadFirstSearchPage();
    }
    if (this.$store.state.search.term) {
      this.interacted = true;
    }
    this.loadFirstSearchPage();
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  display: grid;
  grid-template-columns: 380px 1fr;
}
@media screen and (max-width: 599px) {
  .search-container {
    grid-template-columns: 280px 1fr;
  }
}
</style>
