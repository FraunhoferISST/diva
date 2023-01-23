<template>
  <pre class="code-editor px-3" :style="{ maxHeight: this.height + 'px' }">
    <code class="hljs" ref="editor">
      {{ value }}
    </code>
  </pre>
</template>

<script>
import { CodeJar } from "codejar";
import { withLineNumbers } from "codejar/linenumbers";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/default.css";
import json from "highlight.js/lib/languages/json";

export default {
  name: "JsonFieldEditor",
  inheritAttrs: false,
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [Boolean, Object],
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
  data: () => ({
    editor: null,
    code: null,
  }),
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("update:value", JSON.parse(value));
      },
    },
  },
  watch: {
    value() {
      this.updateCode();
    },
  },
  methods: {
    updateCode() {
      this.editor.updateCode(this.value);
    },
  },
  mounted() {
    hljs.registerLanguage("json", json);
    this.editor = CodeJar(
      this.$refs.editor,
      withLineNumbers((editorElement) => {
        editorElement.innerHTML = hljs.highlight(editorElement.textContent, {
          language: "json",
        }).value;
      })
    );
    this.editor.onUpdate((code) => {
      this.computedValue = code;
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style scoped lang="scss">
.code-editor {
  overflow-y: auto;
  width: 100%;
  @include border-radius();
  border: 2px $bg_card_secondary solid;
  code {
    background-color: white;
  }
}
.hljs {
  padding: 0;
}
</style>
