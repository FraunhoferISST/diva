<template>
  <section id="search" class="relative" v-scroll.self="onScroll">
    <v-container fluid class="pa-0 relative">
      <search-bar
        :input.sync="term"
        :sort-by.sync="sortBy"
        :loading="loading"
        :total="total"
        @input="loadFirstSearchPage"
        @toggleFacets="facetsDrawer = !facetsDrawer"
      />
      <div class="search-container">
        <v-navigation-drawer
          v-model="facetsDrawer"
          fixed
          top
          temporary
          v-if="$vuetify.breakpoint.smAndDown"
        >
          <div class="pb-16">
            <search-facets
              :facets.sync="facets"
              :facets-operator.sync="facetsOperator"
            />
          </div>
        </v-navigation-drawer>
        <search-facets
          v-else
          :facets.sync="facets"
          :facets-operator.sync="facetsOperator"
        />
        <data-viewer :loading="false" :error="error">
          <search-result v-if="items.length > 0" :items="items" />
          <div v-else-if="!loading" class="text-center">
            <p class="ma-0 pa-16 pb-3 text-center">
              <span class="d-inline-block" style="max-width: 400px">
                {{ emptyResultText }}
              </span>
            </p>
            <v-btn
              :to="{ name: 'create' }"
              v-if="!term && !hasSelectedFacets"
              class="mt-3"
              rounded
              text
              color="primary"
            >
              import data
              <v-icon class="ml-2" dense> add </v-icon>
            </v-btn>
          </div>
        </data-viewer>
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
import DataViewer from "@/components/DataFetchers/DataViewer";
import camelCase from "lodash.camelcase";

export default {
  components: {
    DataViewer,
    SearchFacets,
    Observer,
    SearchBar,
    SearchResult,
  },
  name: "Search",
  setup() {
    const offsetTop = ref(0);
    const facetsDrawer = ref(false);
    const facets = ref([]);
    const facetsOperator = ref("Must");
    const sortBy = ref("_score");
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
      facetsDrawer,
      offsetTop,
      facetsOperator,
      sortBy,
      hasSelectedFacets: computed(
        () =>
          facets.value.filter(({ selected }) => selected.length > 0).length > 0
      ),
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
          facetsOperator: camelCase(facetsOperator.value.trim()),
          sortBy: sortBy.value,
        }),
    };
  },
  watch: {
    facetsOperator() {
      this.loadFirstSearchPage(this.term, this.facets);
    },
    sortBy() {
      this.loadFirstSearchPage(this.term, this.facets);
    },
    facets: {
      handler() {
        this.loadFirstSearchPage(this.term, this.facets);
        //this.setRouteParams(this.term, this.facets);
      },
      deep: true,
    },
    term() {
      this.setRouteParams(this.term, this.facets);
    },
  },
  computed: {
    emptyResultText() {
      const baseText = "We could not find anything.";
      const reasonText =
        this.term || this.hasSelectedFacets
          ? "Try something else or adjust facets"
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
    setRouteParams(/*facets = []*/) {
      this.$router.replace({
        name: "search",
        query: {
          ...(this.term ? { term: this.term } : {}),
        },
      });
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
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
      return this.loadFirstSearchPage();
    }
    this.loadFirstSearchPage();
  },
};
</script>

<style lang="scss" scoped>
#search {
  background-color: white;
}
.search-container {
  display: grid;
  grid-template-columns: 380px 1fr;
}
@media screen and (max-width: 1263px) {
  .search-container {
    grid-template-columns: 280px 1fr;
  }
}
@media screen and (max-width: 959px) {
  .search-container {
    display: block;
  }
}
</style>
