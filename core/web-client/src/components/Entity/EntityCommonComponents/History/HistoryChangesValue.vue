<template>
  <v-chip
    class="changes-value"
    v-if="isExpandableValue"
    @click="emitExpand"
    :class="{ 'not-expanded': !expanded }"
    v-bind="props"
  >
    <span style="overflow-wrap: anywhere">{{ formattedValue }} </span>
  </v-chip>
  <v-chip class="changes-value not-expanded" v-else v-bind="props">
    <span style="overflow-wrap: anywhere">{{ formattedValue }} </span>
  </v-chip>
</template>

<script>
export default {
  name: "HistoryChangesValue",
  components: {},
  props: {
    value: {
      required: true,
    },
    color: {
      type: String,
    },
    minified: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    props() {
      return {
        class: "mx-1",
        small: true,
        label: true,
        outlined: true,
        "text-color": this.color,
        color: this.color,
      };
    },
    formattedValue() {
      if (this.value === undefined || this.value === null) {
        return JSON.stringify(this.value);
      }
      if (Array.isArray(this.value)) {
        return "[ ... ]";
      }
      if (typeof (this.value ?? "") === "object") {
        return `{ ${Object.keys(this.value).slice(0, 3).join(", ")}... }`;
      }
      const val = this.trim(this.value);
      return `"${
        this.minified && this.value.length > 100
          ? `${val.slice(0, 100)}...`
          : val
      }"`;
    },
    isExpandableValue() {
      return (
        !this.minified &&
        (Array.isArray(this.value) || typeof this.value === "object")
      );
    },
  },
  methods: {
    trim(string) {
      return string
        .toString()
        .trim()
        .replace(/(\r\n|\n|\r)/gm, " ");
    },
    emitExpand() {
      this.$emit("expand");
    },
  },
};
</script>

<style scoped lang="scss">
.v-chip {
  &.changes-value {
    white-space: break-spaces;
    height: auto;
  }
  padding: 0 4px;
  &.not-expanded {
    border: none;
  }
}
</style>
