<template>
  <div>
    <slot
      :select="select"
      :toggle="toggle"
      :deselect="deselect"
      :selectedIndices="selectedIndices"
    ></slot>
  </div>
</template>

<script>
export default {
  name: "CheckBoxCardGroup",
  props: {
    selected: {
      default: null,
    },
    items: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    selectedIndices: [],
    internalSelected: null,
  }),
  computed: {
    computedSelected: {
      get() {
        return this.selected;
      },
      set(val) {
        this.$emit("update:selected", val);
      },
    },
  },
  methods: {
    toggle(index) {
      if (this.selectedIndices.includes(index)) {
        if (!this.mandatory) {
          this.deselect(index);
        }
      } else {
        this.select(index);
      }
    },
    select(index) {
      if (this.multiple) {
        this.selectedIndices.push(index);
        if (!this.computedSelected) {
          this.computedSelected = [];
          this.internalSelected = [];
        }
        this.computedSelected.push(this.items[index].value);
        this.internalSelected.push({ index, ...this.items[index] });
      }
      this.selectedIndices = [index];
      this.computedSelected = this.items[index].value;
      this.internalSelected = { index, ...this.items[index] };
    },
    deselect(index) {
      this.selectedIndices.slice(index, 1);
      if (this.multiple) {
        const removeIndex = this.internalSelected.findIndex(
          ({ index: i }) => i === index
        );
        this.computedSelected.slice(removeIndex, 1);
        this.internalSelected.slice(removeIndex, 1);
      }
      this.computedSelected = null;
      this.internalSelected = null;
    },
  },
};
</script>

<style scoped lang="scss"></style>
