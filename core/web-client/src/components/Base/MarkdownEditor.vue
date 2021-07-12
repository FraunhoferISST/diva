<template>
  <div class="md-editor-container">
    <switch-slider
      class="md-editor-container-controls"
      :options="[
        { label: 'vertical', icon: 'border_vertical' },
        { label: 'tab', icon: 'view_stream' },
      ]"
      :size="30"
      mini
      inverse
      :selected.sync="viewMode"
    />
    <div ref="mdeditor"></div>
  </div>
</template>

<script>
import Editor from "@toast-ui/editor";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import SwitchSlider from "@/components/Base/SwitchSlider";
export default {
  name: "MarkdownEditor",
  components: { SwitchSlider },
  props: {
    markdown: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    editor: null,
    viewMode: "vertical",
  }),
  watch: {
    viewMode(newVal) {
      this.editor.changePreviewStyle(newVal);
      if (newVal === "vertical") {
        this.toolbar.enableAllButton();
      }
    },
  },
  methods: {
    emitUpdate() {
      this.$emit("update:markdown", this.editor.getMarkdown());
    },
  },
  mounted() {
    this.editor = new Editor({
      usageStatistics: false,
      el: this.$refs.mdeditor,
      height: "500px",
      initialEditType: "markdown",
      initialValue: this.markdown,
      previewStyle: "vertical",
      placeholder: "You can use markdown to edit the description",
      toolbarItems: [
        "heading",
        "bold",
        "italic",
        // "strike",
        "divider",
        "hr",
        "quote",
        "divider",
        "ul",
        "ol",
        // "task",
        // "indent",
        // "outdent",
        "divider",
        "table",
        "image",
        "link",
        /*"divider",
        "code",
        "codeblock",
        "divider"*/
      ],
      hideModeSwitch: true,
      events: {
        change: this.emitUpdate,
      },
    });
    this.toolbar = this.editor.getUI().getToolbar();
  },
  destroyed() {
    this.editor.remove();
  },
};
</script>

<style scoped lang="scss">
.md-editor-container {
  position: relative;
}
.md-editor-container-controls {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 2;
}
.tui-editor-defaultUI {
  border: none;
}
</style>
