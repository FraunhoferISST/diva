<template>
  <v-container class="pa-16 pb-8">
    <h1 class="search-bar-title">Discover your catalog</h1>
    <!--    <p>Some description here</p>-->
    <div class="mt-10">
      <v-form @submit.prevent="onInput">
        <v-text-field
          hide-details
          :loading="loading"
          label="Explore your catalog"
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
        <div class="search-bar-total pr-3">
          {{ total }} Item{{ total > 1 ? "s" : "" }}
        </div>
      </div>
      <div>
        <v-select
          dense
          rounded
          flat
          hide-details
          :items="['Creation', 'Last modified', 'Title']"
          label="Sort by"
          solo
        ></v-select>
      </div>
    </div>
  </v-container>
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
    loading: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
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
  //background-color: white;
  //border-bottom: 2px solid $bg_card_secondary;
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
</style>
