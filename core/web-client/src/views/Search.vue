<template>
  <section
    id="search"
    class="relative"
    :class="{ interacted: interacted }"
    v-scroll.self="onScroll"
  >
    <search-bar
      :input.sync="term"
      :loading="isLoading"
      :interacted="interacted"
      :totalSearchResults="totalSearchResults"
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
      <v-container
        class="ma-0"
        fluid
        v-else
        :class="{ 'fill-height': interacted }"
      >
        <v-row>
          <v-col cols="12">
            <fade-in>
              <div class="text-center" v-if="!isLoading">
                <img
                  v-if="interacted"
                  width="150"
                  :src="require('@/assets/illustrations/nodata.svg')"
                />
                <no-data-state>
                  <p>
                    {{ emptyResultText }}
                    <br />
                    <v-btn
                      :to="{ name: 'create' }"
                      v-if="!this.term"
                      class="mt-3"
                      rounded
                      text
                      color="primary"
                    >
                      import data
                      <v-icon class="ml-2" dense> add </v-icon>
                    </v-btn>
                  </p>
                </no-data-state>
              </div>
            </fade-in>
          </v-col>
        </v-row>
      </v-container>
    </fade-in>
    <observer
      v-if="searchResults.length > 0 && !isLoading"
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
      <template #completed v-if="searchResults.length > pageSize">
        <p class="text-center py-10">All results loaded</p>
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
  data: () => ({
    interacted: false,
    isLoading: true,
    searchResults: [],
    totalSearchResults: 0,
    offsetTop: 0,
    cursor: null,
    pageSize: 45,
  }),
  watch: {
    term() {
      this.$router.replace({
        name: "search",
        query: { term: this.term },
      });
      this.cursor = null;
      this.interacted = true;
      this.isLoading = true;
      this.debounceSearch();
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
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
      if (e.target.scrollTop > 220) {
        this.interacted = true;
      }
    },
    submitSearch() {
      this.cursor = null;
      this.search();
    },
    debounceSearch() {
      searchDebouncer.debounce(this.search);
    },
    loadNextPage(observerState) {
      if (this.cursor) {
        observerState.loading = true;
        this.makeSearchRequest().then(({ items, cursor, total }) => {
          this.searchResults.push(...items);
          this.cursor = cursor;
          this.totalSearchResults = total;
          observerState.loading = false;
          if (!cursor) {
            observerState.completed = true;
          }
        });
      }
    },
    makeSearchRequest() {
      return this.$api
        .search(this.term.trim(), this.pageSize, this.cursor)
        .then(({ data }) => ({
          items: data.collection.filter(({ doc }) =>
            ["resource", "asset"].includes(doc.entityType)
          ),
          cursor: data.cursor,
          total: data.total,
        }))
        .finally(() => (this.isLoading = false));
    },
    async search() {
      this.isLoading = true;
      const { items, cursor, total } = await this.makeSearchRequest();
      this.cursor = cursor;
      this.searchResults = items;
      this.totalSearchResults = total;
    },
  },
  mounted() {
    if (this.$route.query.term) {
      this.interacted = true;
      if (this.$route.query.term !== this.$store.state.search.term) {
        this.term = this.$route.query.term;
      } else {
        return this.search();
      }
    }
    if (this.$store.state.search.term) {
      this.interacted = true;
    }
    this.search();
  },
};
</script>

<style lang="scss" scoped>
#search {
  max-height: 100vh;
  overflow-y: auto;
  transition: 0.3s;
  padding-top: 300px;
  &.interacted {
    padding-top: 80px;
  }
}
</style>
