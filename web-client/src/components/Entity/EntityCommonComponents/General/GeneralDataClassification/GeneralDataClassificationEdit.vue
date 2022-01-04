<template>
  <v-col cols="12">
    <edit-activate-transition>
      <v-autocomplete
        v-model="computedDataClassification"
        :items="dataClassificationList"
        hide-details
        chips
        deletable-chips
        small-chips
        open-on-clear
        clearable
        outlined
        dense
        autofocus
      >
      </v-autocomplete>
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
export default {
  name: "GeneralDataClassificationEdit",
  components: { EditActivateTransition },
  props: {
    dataClassification: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    dataClassificationList: [
      "Public",
      "Internal",
      "Confidential",
      "Restricted",
    ],
  }),
  computed: {
    computedDataClassification: {
      get() {
        return this.dataClassification;
      },
      set(value) {
        this.$emit("update:dataClassification", {
          dataClassification: value ?? null,
        });
      },
    },
  },
};
</script>
