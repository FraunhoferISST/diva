<template>
  <v-col cols="12">
    <edit-activate-transition>
      <div class="relative">
        <location-map
          :location="computedLocation"
          :editable="true"
          @change="onChange"
        />
      </div>
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
import LocationMap from "@/components/Charts/LocationMap";

export default {
  name: "GeneralDescriptionEdit",
  components: { LocationMap, EditActivateTransition },
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
  methods: {
    onChange(data) {
      this.computedLocation = data;
    },
  },
};
</script>
