<template>
  <v-snackbar v-model="computedSnackbar" v-bind="$attrs">
    <div class="d-flex justify-space-between align-center">
      <b>
        {{ message }}
      </b>
      <slot>
        <v-btn
          v-if="manualReload"
          text
          small
          color="primary"
          @click="emitReload"
        >
          Load changes
        </v-btn>
      </slot>
    </div>
  </v-snackbar>
</template>

<script>
import { VSnackbar } from "vuetify/lib/components/VSnackbar";
export default {
  name: "EntityEventSnackbar",
  props: {
    ...VSnackbar.props,
    snackbar: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    manualReload: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedSnackbar: {
      get() {
        return this.snackbar;
      },
      set(val) {
        return this.$emit("update:snackbar", val);
      },
    },
  },
  methods: {
    emitReload() {
      this.$emit("reload");
      this.computedSnackbar = false;
    },
  },
};
</script>

<style scoped></style>
