<template>
  <v-switch
    class="ma-0 pa-2"
    dense
    inset
    hide-details
    v-model="computedValue"
    :label="title"
  ></v-switch>
</template>

<script>
export default {
  name: "BooleanFieldEditor",
  inheritAttrs: false,
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
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
