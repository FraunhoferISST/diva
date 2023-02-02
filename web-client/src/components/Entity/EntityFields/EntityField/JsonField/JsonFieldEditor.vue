<template>
  <CodeEditor
    v-model="computedValue"
    :languages="[['json', 'JSON']]"
    :copy_code="false"
    width="100%"
  ></CodeEditor>
</template>

<script>
import CodeEditor from "simple-code-editor";

export default {
  name: "JsonFieldEditor",
  components: {
    CodeEditor,
  },
  inheritAttrs: false,
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
    height: {
      type: Number,
      default: 500,
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        try {
          JSON.parse(value);
          this.$emit("update:value", value);
        } catch (e) {
          if (value === "") {
            this.$emit("update:value", value);
          }
        }
      },
    },
  },
  beforeMount() {
    try {
      this.computedValue = JSON.stringify(JSON.parse(this.value), null, 3);
    } catch (e) {
      this.computedValue = this.value;
    }
  },
};
</script>

<style scoped lang="scss"></style>
