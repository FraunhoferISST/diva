<template>
  <div>
    <v-col cols="12">
      <edit-activate-transition>
        <v-text-field
          v-model="computedTitle"
          color="info"
          label="Resource Title"
          clearable
          autofocus
          outlined
          hide-details
          background-color="transparent"
          class="custom-input"
        >
        </v-text-field>
      </edit-activate-transition>
    </v-col>
  </div>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";

export default {
  name: "GeneralTitleEdit",
  components: { EditActivateTransition },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    computedTitle: {
      get() {
        return this.title;
      },
      set(value) {
        this.$emit("update:title", { title: value });
      },
    },
  },
};
</script>
