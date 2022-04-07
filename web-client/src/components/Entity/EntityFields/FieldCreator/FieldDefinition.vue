<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="computedPropertyName"
          label="Unique property name"
          placeholder="e.g. myNewProperty"
          outlined
          dense
          rounded
          hide-details
          autofocus
          background-color="transparent"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="computedTitle"
          label="Property Title"
          placeholder="e.g My property"
          outlined
          dense
          rounded
          hide-details
          autofocus
          background-color="transparent"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="computedDescription"
          label="Property description"
          placeholder="Concise description of the new property"
          outlined
          dense
          hide-details
          rows="3"
          autofocus
          background-color="transparent"
        >
        </v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed } from "@vue/composition-api";
import camelCase from "lodash.camelcase";

export default {
  name: "FieldDefinition",
  props: {
    propertyName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const computedPropertyName = computed({
      get() {
        return props.propertyName;
      },
      set(val) {
        return emit("update:propertyName", val ? camelCase(val) : "");
      },
    });
    const computedTitle = computed({
      get() {
        return props.title;
      },
      set(val) {
        return emit("update:title", val ?? "");
      },
    });
    const computedDescription = computed({
      get() {
        return props.description;
      },
      set(val) {
        return emit("update:description", val ?? "");
      },
    });
    return {
      computedPropertyName,
      computedTitle,
      computedDescription,
    };
  },
};
</script>

<style scoped></style>
