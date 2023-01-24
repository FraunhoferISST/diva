<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12">
        <custom-header> From Point in Time </custom-header>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="12">
        {{ value }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";

export default {
  name: "StdFromPointInTimeEditor",
  components: {
    CustomHeader,
  },
  props: {
    value: {
      type: String,
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
