<template>
  <div class="search-bar-container" :class="{ interacted: interacted }">
    <div
      class="search-bar-image d-flex justify-center"
      :class="{ interacted: interacted }"
    >
      <fade-out-in>
        <img
          id="diva-typo"
          alt="DIVA"
          width="200"
          :src="require('@/assets/diva_logo_typo.svg')"
          v-if="!interacted"
        />
      </fade-out-in>
    </div>
    <div class="d-flex justify-center">
      <v-form
        class="full-width"
        style="max-width: 700px"
        @submit.prevent="onInput"
      >
        <v-text-field
          hide-details
          :loading="loading"
          label="Explore your catalog"
          outlined
          flat
          rounded
          autofocus
          :dense="interacted"
          full-width
          v-model="computedInput"
        />
      </v-form>
    </div>
  </div>
</template>

<script>
import { Debouncer } from "@/utils/utils";
const searchDebouncer = new Debouncer();

import FadeOutIn from "@/components/Transitions/FadeOutIn";
export default {
  name: "SearchBar",
  components: { FadeOutIn },
  props: {
    input: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    interacted: {
      type: Boolean,
      default: false,
    },
    totalSearchResults: {
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
  background-color: white;
  border-bottom: 2px solid $bg_card_secondary;
  padding: 60px 0;
  &.interacted {
    margin-bottom: 0;
    padding: 10px 0;
  }
}
.search-bar-image {
  transition: 0.3s;
  height: 65px;
  margin-bottom: 20px;
  &.interacted {
    height: 0;
    margin-bottom: 0;
  }
}
</style>
