<template>
  <v-textarea
    dense
    v-model="computedValue"
    color="info"
    :label="title"
    clearable
    autofocus
    outlined
    :counter="showCounter"
    :hide-details="!showCounter"
    :minlength="minLength"
    :maxlength="maxLength"
    rows="5"
    background-color="transparent"
  >
  </v-textarea>
</template>

<script>
export default {
  name: "TextAreaFieldEditor",
  inheritAttrs: false,
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    minLength: {
      type: Number,
      required: false,
    },
    maxLength: {
      type: Number,
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
    showCounter() {
      return !!(this.minLength || this.maxLength);
    },
  },
};
</script>

<style scoped></style>
