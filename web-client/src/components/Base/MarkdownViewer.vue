<template>
  <div class="md-viewer"></div>
</template>

<script>
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
export default {
  name: "MarkdownViewer",
  props: {
    markdown: {
      type: String,
      required: true,
    },
  },
  watch: {
    markdown() {
      this.viewer.setMarkdown(this.markdown);
    },
  },
  mounted() {
    this.viewer = new Viewer({
      usageStatistics: false,
      el: this.$el,
      height: "500px",
      initialValue: this.markdown,
    });
  },
  destroyed() {
    this.viewer.remove();
  },
};
</script>
<style lang="scss">
.md-viewer {
  * {
    font-family: $font_body;
  }
  .tui-editor-contents {
    p {
      margin-top: 0;
      color: $font_secondary_color;
    }
  }
}
</style>
