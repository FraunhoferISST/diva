<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <h2>
          Condition is fulfilled, if property
          <v-chip label>
            {{ value.property }}
          </v-chip>
          {{ isSet }}
          in the executing DCA.
        </h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";

export default {
  name: "StdDcaPropertyViewer",
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { snackbar, message, color } = useSnackbar();
    const { loading, error } = useRequest();
    const isSet = `${props.value.has ? "is set" : "is not set"}`;
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      isSet,
    };
  },
};
</script>

<style scoped lang="scss"></style>
