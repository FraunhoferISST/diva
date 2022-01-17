<template>
  <v-col cols="12">
    <edit-activate-transition>
      <v-autocomplete
        v-model="computedPoliticalGeocoding"
        :items="politicalGeocodingList"
        hide-details
        chips
        autofocus
        auto-select-first
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
  name: "GeneralPoliticalGeocodingEdit",
  components: { EditActivateTransition },
  props: {
    politicalGeocoding: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    politicalGeocodingList: [
      "International",
      "European",
      "Federal",
      "State",
      "Administrative District",
      "Municipality",
    ],
  }),
  computed: {
    computedPoliticalGeocoding: {
      get() {
        return this.politicalGeocoding;
      },
      set(value) {
        this.$emit("update:politicalGeocoding", {
          politicalGeocoding: value ?? null,
        });
      },
    },
  },
};
</script>
