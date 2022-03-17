<template>
  <v-combobox
    class="custom-autocomplete custom-input"
    v-model="computedValue"
    :items="options"
    hide-selected
    :deletable-chips="true"
    :label="title"
    :multiple="multiple"
    persistent-hint
    small-chips
    clearable
    outlined
    background-color="transparent"
    hide-details
    autofocus
  >
    <template #no-data>
      <v-list-item dense>
        <v-list-item-content>
          <v-list-item-title>
            <p class="ma-0">
              Press <kbd>enter</kbd> or <kbd>tab</kbd> to add a new value
            </p>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
export default {
  name: "SelectFieldEditor",
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
    options: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: "text",
      validator: (val) => ["text", "number", "email"].includes(val),
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    allowCustom: {
      type: Boolean,
      default: false,
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
