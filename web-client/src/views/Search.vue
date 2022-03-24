<template>
  <section id="search" class="relative" v-scroll.self="onScroll">
    <v-container
      class="pa-0 fill-height d-block relative"
      style="background-color: white"
    >
      <search-bar
        :input.sync="term"
        :loading="loading"
        :interacted="interacted"
        :totalSearchResults="total"
        @input="loadFirstSearchPage"
      />
      <v-container class="pa-0 pt-0 pb-12">
        <fade-in>
          <v-container v-if="items.length > 0 && !loading" class="pa-0">
            <search-result :search-result="items" />
          </v-container>
          <v-container v-else class="pa-16">
            <v-row>
              <v-col cols="12">
                <fade-in>
                  <div class="text-center" v-if="!loading">
                    <img
                      v-if="interacted"
                      width="150"
                      alt="No results"
                      :src="require('@/assets/illustrations/nodata.svg')"
                    />
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
                  </div>
                </fade-in>
              </v-col>
            </v-row>
          </v-container>
        </fade-in>
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
          <template #completed v-if="items.length > pageSize">
            <p class="text-center py-10">All results loaded</p>
          </template>
        </observer>
      </v-container>
    </v-container>
  </section>
</template>

<script>
import SearchResult from "@/components/Search/SearchResult";
import FadeIn from "@/components/Transitions/FadeIn";
import SearchBar from "@/components/Search/SearchBar";
import Observer from "@/components/Base/Observer";
import { useSearch } from "@/composables/search";
import { computed, ref } from "@vue/composition-api";

export default {
  components: {
    Observer,
    SearchBar,
    FadeIn,
    SearchResult,
  },
  name: "Search",
  setup() {
    const items = ref([]);
    const pageSize = ref(5);
    const { search, data, loading, error, cursor, total } = useSearch();
    return {
      pageSize,
      loading,
      error,
      search,
      cursor,
      data,
      total,
      searchResult: computed(() => data.value?.collection ?? []),
      items,
    };
  },
  data: () => ({
    interacted: false,
    offsetTop: 0,
  }),
  watch: {
    term() {
      this.$router.replace({
        name: "search",
        query: { term: this.term },
      });
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
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
      if (e.target.scrollTop > 220) {
        this.interacted = true;
      }
    },
    submitSearch() {
      this.cursor = null;
      this.loadFirstSearchPage();
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
    loadFirstSearchPage() {
      this.cursor = null;
      return this.search(this.term.trim(), this.pageSize).then(
        () =>
          (this.items = this.searchResult.filter(({ doc }) =>
            ["resource", "asset"].includes(doc.entityType)
          ))
      );
    },
    loadSearchPage() {
      return this.search(this.term.trim(), this.pageSize).then(() =>
        this.items.push(
          ...this.searchResult.filter(({ doc }) =>
            ["resource", "asset"].includes(doc.entityType)
          )
        )
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

<style lang="scss" scoped></style>
