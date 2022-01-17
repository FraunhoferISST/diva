<template>
  <div>
    <v-col cols="12">
      <edit-activate-transition>
        <v-text-field
          dense
          color="info"
          clearable
          autofocus
          outlined
          hide-details
          background-color="transparent"
          class="custom-input"
          label="Resource version notes"
          placeholder="Insert version notes here"
          v-model="computedVersionNotes"
        >
        </v-text-field>
      </edit-activate-transition>
    </v-col>
  </div>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";

export default {
  name: "GeneralVersionNotesEdit",
  components: { EditActivateTransition },
  props: {
    versionNotes: {
      type: String,
      required: true,
    },
  },
  computed: {
    computedVersionNotes: {
      get() {
        return this.versionNotes;
      },
      set(value) {
        this.$emit("update:versionNotes", { versionNotes: value });
      },
    },
  },
};
</script>
