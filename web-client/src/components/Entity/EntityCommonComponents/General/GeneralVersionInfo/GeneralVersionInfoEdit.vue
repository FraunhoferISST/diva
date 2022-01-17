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
          label="Resource Version Info"
          placeholder="Insert version info here"
          v-model="computedVersionInfo"
        >
        </v-text-field>
      </edit-activate-transition>
    </v-col>
  </div>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";

export default {
  name: "GeneralVersionInfoEdit",
  components: { EditActivateTransition },
  props: {
    versionInfo: {
      type: String,
      required: true,
    },
  },
  computed: {
    computedVersionInfo: {
      get() {
        return this.versionInfo;
      },
      set(value) {
        this.$emit("update:versionInfo", { versionInfo: value });
      },
    },
  },
};
</script>
