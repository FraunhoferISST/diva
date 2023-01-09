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
      validator: (val) => {
        return ["text", "number"].includes(val);
      },
      require: true,
    },
  },
  computed: {
    computedValue: {
      get() {
        console.log(typeof this.value);
        return this.value;
      },
      set(value) {
        console.log(typeof value);
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
