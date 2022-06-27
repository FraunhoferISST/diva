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
        <v-text-field
          outlined
          dense
          hide-details
          v-model="computedValue"
          :label="title"
          readonly
          v-bind="attrs"
          v-on="on"
          :clearable="clearable"
        ></v-text-field>
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
      required: false,
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
        if (value === null) {
          this.$emit("update:value", null);
        } else {
          this.$emit("update:value", new Date(value).toISOString());
        }
      },
    },
  },
};
</script>

<style scoped></style>
