<template>
  <v-text-field
    dense
    v-model.trim="computedValue"
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
  inheritAttrs: false,
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
        this.$emit(
          "update:value",
          this.type === "number" ? parseFloat(value) : value
        );
      },
    },
  },
};
</script>

<style scoped></style>
