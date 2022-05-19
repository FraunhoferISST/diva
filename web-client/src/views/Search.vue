<template>
  <section id="search" class="relative" v-scroll.self="onScroll">
    <v-container fluid class="pa-0 relative">
      <search-bar
        :input.sync="term"
        :sort-by.sync="sortBy"
        :loading="loading"
        :total="total"
        @input="() => searchEntities(term)"
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
          <search-result v-if="searchResult.length > 0" :items="searchResult" />
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
          <observer
            class="py-4"
            v-if="searchResult.length > 0"
            @intersect="onObserverIntersection"
          >
            <template #completed>
              <p class="ma-0 text-center">All results loaded</p>
            </template>
          </observer>
        </data-viewer>
      </div>
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
    const pageSize = ref(10);
    const { search, loadNextPage, data, loading, error, cursor, total } =
      useSearch();
    return {
      pageSize,
      loading,
      error,
      cursor,
      data,
      total,
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
      onObserverIntersection: (changeStateMethod) => {
        if (cursor.value) {
          changeStateMethod({ loading: true });
          loadNextPage().then(() => {
            changeStateMethod({ loading: false });
            if (!cursor.value) {
              changeStateMethod({ completed: true });
            }
          });
        }
      },
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
      loadNextPage,
    };
  },
  watch: {
    facetsOperator() {
      this.searchEntities(this.term);
    },
    sortBy() {
      this.searchEntities(this.term);
    },
    facets: {
      handler() {
        this.searchEntities(this.term);
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
    setRouteParams() {
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
  },
  mounted() {
    if (this.$route.query.term) {
      this.term = this.$route.query.term;
    }
    this.searchEntities(this.term);
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
  padding-bottom: 100px;
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
