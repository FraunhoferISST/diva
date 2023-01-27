<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <h2>
          Condition is fulfilled on <v-chip label>{{ dateString }}</v-chip
          >.
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { format, parseISO } from "date-fns";

export default {
  name: "StdFromPointInTimeEditor",
  props: {
    value: {
      type: Object,
      required: true,
    },
    format: {
      type: String,
      default: "dd.MM.yyyy HH:mm",
    },
  },
  computed: {
    dateString() {
      return format(parseISO(this.value.from), this.format);
    },
  },
  setup() {
    const { snackbar, message, color } = useSnackbar();
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
