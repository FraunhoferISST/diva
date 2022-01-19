<template>
  <div class="user-avatar-editor relative">
    <vue-avatar
      :width="size"
      :height="size"
      :borderRadius="150"
      :scale="zoom"
      ref="avatar"
      :border="1"
      :placeholder-svg="placeHolder"
      :color="[240, 244, 249, 0.7]"
      @vue-avatar-editor:image-ready="save"
    >
    </vue-avatar>
    <v-slider
      v-if="image"
      v-model="zoom"
      prepend-icon="zoom_in"
      hide-details
      min="1"
      max="10"
    />
  </div>
</template>

<script>
import { VueAvatar } from "vue-avatar-editor-improved";

export default {
  name: "UserAvatarEditor",
  components: { VueAvatar },
  props: {
    image: {
      required: true,
    },
    size: {
      type: Number,
      default: 250,
    },
  },
  data: () => ({
    zoom: 1,
    avatarUrl: "",
    loading: false,
    placeHolder:
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg id="i-upload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#f0f4f9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">\n' +
      '    <path d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 18 L16 14 21 18 M16 14 L16 29" />\n' +
      "</svg>",
  }),
  computed: {
    computedImage: {
      get() {
        return this.image;
      },
      set(val) {
        this.$emit("update:image", val);
      },
    },
  },
  methods: {
    async save() {
      this.loading = true;
      const imgCanvas = this.$refs.avatar.getImageScaled();
      this.avatarUrl = imgCanvas.toDataURL();
      const imgBlob = await this.convertToBlob(imgCanvas);
      const imgUrl = imgCanvas.toDataURL();
      this.$emit("imageReady", { imgBlob, imgUrl });
      this.computedImage = imgBlob;
      this.loading = false;
    },
    removeAvatar() {
      this.avatarUrl = "";
    },
    convertToBlob(imgCanvas) {
      return new Promise((resolve) => {
        imgCanvas.toBlob((blob) => resolve(blob), "image/png");
      });
    },
  },
};
</script>

<style lang="scss">
.user-avatar-editor {
  canvas {
    border-radius: 200px;
  }
}
</style>
