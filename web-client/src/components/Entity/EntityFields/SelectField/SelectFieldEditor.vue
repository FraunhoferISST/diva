<template>
  <component
    :is="selectComponent"
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
    dense
  >
    <template #no-data v-if="allowCustom">
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
  </component>
</template>

<script>
import { VSelect, VCombobox } from "vuetify/lib/components";
export default {
  name: "SelectFieldEditor",
  inheritAttrs: false,
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Array],
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
    selectComponent() {
      return this.allowCustom ? VCombobox : VSelect;
    },
  },
};
</script>

<style scoped></style>
