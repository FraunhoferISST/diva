<template>
  <markdown-editor :markdown.sync="computedValue" />
</template>

<script>
import MarkdownEditor from "@/components/Base/MarkdownEditor";
export default {
  name: "MarkdownFieldEditor",
  inheritAttrs: false,
  components: { MarkdownEditor },
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: String,
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
