<template>
  <v-col cols="12">
    <edit-activate-transition>
      <v-autocomplete
        v-model="computedPlannedAvailability"
        :items="plannedAvailabilityLevelsList"
        hide-details
        chips
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
  name: "GeneralPlannedAvailabilityEdit",
  components: { EditActivateTransition },
  props: {
    plannedAvailability: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    plannedAvailabilityLevelsList: [
      "Temporary",
      "Experimental",
      "Available",
      "Stable",
    ],
  }),
  computed: {
    computedPlannedAvailability: {
      get() {
        return this.plannedAvailability;
      },
      set(value) {
        this.$emit("update:plannedAvailability", {
          plannedAvailability: value || null,
        });
      },
    },
  },
};
</script>
