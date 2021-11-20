<template>
  <v-col cols="12">
    <edit-activate-transition>
      <div>DEMO</div>
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
        return this.location;
      },
      set(value) {
        this.$emit("update:location", { location: value });
      },
    },
  },
};
</script>
