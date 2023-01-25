<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12"> From Point in Time: {{ value.from }} </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";

export default {
  name: "StdFromPointInTimeEditor",
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const { snackbar, message, color, show } = useSnackbar();
    const { loading, error } = useRequest();
    return {
      loading,
      error,
      snackbar,
      message,
      color,
    };
  },
};
</script>

<style scoped lang="scss"></style>
