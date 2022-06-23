<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <v-combobox
          outlined
          dense
          hide-details
          v-model="computedValue"
          chips
          small-chips
          :label="title"
          readonly
          v-bind="attrs"
          v-on="on"
          :clearable="clearable"
        ></v-combobox>
      </template>
      <v-date-picker v-model="computedValue" no-title scrollable>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "DateFieldEditor",
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
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("update:value", new Date(value).toISOString());
      },
    },
  },
};
</script>

<style scoped></style>
