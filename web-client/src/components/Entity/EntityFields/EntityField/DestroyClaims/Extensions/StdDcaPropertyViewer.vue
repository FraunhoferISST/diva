<template>
  <v-container class="pa-0">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <h2>Destroy Claim valid when {{ text }}</h2>
            </v-list-item-title>
            <v-list-item-subtitle>
              <h2>
                {{ value.property }}
              </h2>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
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
    const text = `DCA has ${props.value.has ? "" : "not "}Property `;
    return {
      loading,
      error,
      snackbar,
      message,
      color,
      text,
    };
  },
};
</script>

<style scoped lang="scss"></style>
