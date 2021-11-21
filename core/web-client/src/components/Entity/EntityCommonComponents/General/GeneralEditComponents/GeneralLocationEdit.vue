<template>
  <v-col cols="12">
    <edit-activate-transition>
      <v-textarea v-model="computedLocation"></v-textarea>
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";

export default {
  name: "GeneralDescriptionEdit",
  components: { EditActivateTransition },
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  computed: {
    computedLocation: {
      get() {
        return JSON.stringify(this.location);
      },
      set(value) {
        this.$emit("update:location", { location: JSON.parse(value) });
      },
    },
  },
};
</script>
