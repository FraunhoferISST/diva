<template>
  <div class="search-bar-container">
    <v-container class="pa-4 pa-md-16 pb-8 pb-md-8">
      <h1 class="search-bar-title">Discover your catalog</h1>
      <!--    <p>Some description here</p>-->
      <div class="mt-4 mt-md-10">
        <v-form @submit.prevent="onInput">
          <v-text-field
            :dense="$vuetify.breakpoint.smAndDown"
            hide-details
            :loading="loading"
            label="Search by Title, Description, Filename etc."
            outlined
            flat
            rounded
            autofocus
            full-width
            v-model="computedInput"
          />
        </v-form>
      </div>
      <div
        class="search-bar-stats pt-10 px-0 py-0 d-flex justify-space-between align-center"
      >
        <div class="d-flex align-center">
          <v-btn
            small
            icon
            class="mr-3 d-block d-md-none"
            color="primary"
            @click="() => $emit('toggleFacets')"
          >
            <v-icon small> filter_list </v-icon>
          </v-btn>
          <span class="search-bar-total">
            {{ total }} Item{{ total > 1 ? "s" : "" }}
          </span>
        </div>
        <div style="max-width: 220px; min-width: 10px; overflow: hidden">
          <v-select
            v-model="computedSortBy"
            dense
            rounded
            flat
            hide-details
            :items="sortByItems"
            item-text="title"
            item-value="field"
            label="Sort by"
            solo
          ></v-select>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { Debouncer } from "@/utils/utils";
const searchDebouncer = new Debouncer();
export default {
  name: "SearchBar",
  components: {},
  props: {
    input: {
      type: String,
      required: true,
    },
    sortBy: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    sortByItems: [
      {
        title: "Relevance",
        field: "_score",
      },
      {
        title: "Recently created",
        field: "createdAt",
      },
      {
        title: "Last modified",
        field: "modifiedAt",
      },
    ],
  }),
  computed: {
    computedInput: {
      get() {
        return this.input;
      },
      set(val) {
        this.onInput();
        return this.$emit("update:input", val);
      },
    },
    computedSortBy: {
      get() {
        return this.sortBy;
      },
      set(val) {
        return this.$emit("update:sortBy", val);
      },
    },
  },
  methods: {
    onInput() {
      searchDebouncer.debounce(() => this.$emit("input"));
    },
  },
};
</script>

<style scoped lang="scss">
.search-bar-container {
  background-color: $bg_card_secondary;
}
.search-bar-title {
  font-family: $font_header;
  letter-spacing: 0.07rem;
  display: block;
  font-size: 3rem !important;
  font-weight: bolder;
  opacity: 0.9;
}
.search-bar-total {
  min-width: 80px;
  font-family: Montserrat;
  font-weight: bolder;
  font-size: 1rem;
}
@media screen and (max-width: 959px) {
  .search-bar-title {
    font-size: 2.2rem !important;
  }
}
</style>
