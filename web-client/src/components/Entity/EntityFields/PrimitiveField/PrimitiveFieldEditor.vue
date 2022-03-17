<template>
  <v-text-field
    dense
    v-model="computedValue"
    color="info"
    :label="title"
    :type="type"
    clearable
    autofocus
    outlined
    hide-details
    background-color="transparent"
  >
  </v-text-field>
</template>

<script>
export default {
  name: "PrimitiveFieldEditor",
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
      validator: (val) => ["text", "number"].includes(val),
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("update:value", value);
      },
    },
  },
};
</script>

<style scoped></style>
