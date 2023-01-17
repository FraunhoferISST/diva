<template>
  <v-text-field
    v-model="computedValue"
    :label="label"
    :placeholder="placeholder"
    :rules="rules"
    outlined
    dense
    rounded
    hide-details
    autofocus
    background-color="transparent"
  >
  </v-text-field>
</template>

<script>
export default {
  name: "SourceTextInput",
  components: {},
  props: {
    label: {
      type: String,
      default: "Add value",
    },
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      required: true,
    },
    rules: {
      type: Array,
      required: false,
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
