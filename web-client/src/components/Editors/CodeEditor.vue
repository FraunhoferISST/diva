<template>
  <pre class="code-editor px-3" :style="{ maxHeight: this.height + 'px' }">
    <code class="hljs" ref="editor">
      {{ code }}
    </code>
  </pre>
</template>

<script>
import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/default.css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
export default {
  name: "CodeEditor",
  props: {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
      validator: (val) => ["json", "javascript"].includes(val),
    },
    height: {
      type: Number,
      default: 500,
    },
  },
  data: () => ({
    editor: null,
    languagesMap: {
      json: json,
      javascript: javascript,
    },
  }),
  watch: {
    code() {
      this.updateCode();
    },
  },
  methods: {
    updateCode() {
      this.editor.updateCode(this.code);
    },
  },
  mounted() {
    hljs.registerLanguage(this.language, this.languagesMap[this.language]);
    this.editor = CodeJar(this.$refs.editor, (editorElement) => {
      editorElement.innerHTML = hljs.highlight(editorElement.textContent, {
        language: this.language,
      }).value;
    });
    this.editor.onUpdate((code) => {
      this.$emit("update", code);
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
    background-color: unset;
  }
}
.hljs {
  padding: 0;
}
</style>
