<template>
  <v-col cols="12">
    <edit-activate-transition>
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
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
import countries from "@/utils/countries.json";
export default {
  name: "GeneralLanguagesEdit",
  components: { EditActivateTransition },
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
        this.$emit("update:languages", {
          languages: value.length > 0 ? value : null,
        });
      },
    },
  },
};
</script>
