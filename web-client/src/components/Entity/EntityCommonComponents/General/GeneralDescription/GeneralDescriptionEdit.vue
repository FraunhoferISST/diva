<template>
  <v-col cols="12">
    <edit-activate-transition>
      <markdown-editor :markdown.sync="computedDescription" />
    </edit-activate-transition>
  </v-col>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
import MarkdownEditor from "@/components/Base/MarkdownEditor";

export default {
  name: "GeneralDescriptionEdit",
  components: { MarkdownEditor, EditActivateTransition },
  props: {
    description: {
      type: String,
      required: true,
    },
  },
  computed: {
    computedDescription: {
      get() {
        return this.description;
      },
      set(value) {
        this.$emit("update:description", { description: value });
      },
    },
  },
};
</script>
