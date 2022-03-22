<template>
  <v-autocomplete
    v-model="computedLanguages"
    :items="countriesList"
    hide-details
    chips
    multiple
    deletable-chips
    small-chips
    clearable
    outlined
    dense
    item-text="language"
    item-value="alpha2"
    return-object
  >
    <template #item="data">
      <v-list-item-content>
        <v-list-item-title>
          {{ data.item.language }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ data.item.alpha2.toUpperCase() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import countries from "@/utils/countries.json";
export default {
  name: "LanguagesEdit",
  props: {
    languages: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    countriesList: countries,
  }),
  computed: {
    computedLanguages: {
      get() {
        return this.languages;
      },
      set(value) {
        this.$emit("update:languages", value.length > 0 ? value : null);
      },
    },
  },
};
</script>
