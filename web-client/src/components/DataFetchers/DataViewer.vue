<template>
  <div>
    <v-expand-transition>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        width="2"
      ></v-progress-circular>
      <v-alert
        key="alert"
        v-else-if="error"
        dense
        text
        color="error"
        class="text-center ma-0"
      >
        <p class="text-center ma-0">
          {{ errorMessage || "Some error occurred while loading data" }}
        </p>
      </v-alert>
      <slot v-else> </slot>
    </v-expand-transition>
  </div>
</template>
<script>
export default {
  name: "DataViewer",
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    error: {
      default: null,
    },
  },
  computed: {
    errorMessage() {
      if (this.error) {
        return (
          this.error?.response?.data?.message ??
          this.error?.message ??
          this.error.toString() ??
          "Somme error occurred"
        );
      }
      return "";
    },
  },
};
</script>

<style scoped></style>
