<template>
  <v-col cols="12">
    <edit-activate-transition>
      <v-autocomplete
        v-model="computedThemes"
        :items="themesList"
        hide-details
        chips
        multiple
        deletable-chips
        small-chips
        clearable
        outlined
        dense
      >
      </v-autocomplete>
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
export default {
  name: "GeneralThemesEdit",
  components: { EditActivateTransition },
  props: {
    themes: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    themesList: [
      "Agriculture",
      "Culture",
      "Economy",
      "Education",
      "Energy",
      "Environment",
      "Finance",
      "Fisheries",
      "Health",
      "Infrastructure",
      "International",
      "Justice",
      "Population",
      "Public Sector",
      "Regional",
      "Science",
      "Society",
      "Sports",
      "Technology",
      "Transport",
    ],
  }),
  computed: {
    computedThemes: {
      get() {
        return this.themes;
      },
      set(value) {
        this.$emit("update:themes", {
          themes: value.length > 0 ? value : null,
        });
      },
    },
  },
};
</script>
