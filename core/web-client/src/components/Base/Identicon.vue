<template>
  <img
    :width="options.size"
    :style="{ width: `${options.size}px`, height: `${options.size}px` }"
    alt="Resource Hash Icon"
    :title="`Icon for Resource ${hash}`"
    :src="identicon"
  />
</template>

<script>
const hashicon = require("hashicon");
const Identicon = require("identicon.js");

export default {
  name: "Identicon",
  props: {
    hash: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({
        size: 32,
        background: [0, 0, 0, 0],
      }),
    },
  },
  computed: {
    identicon() {
      const hash = this.hash;
      if (hash.startsWith("asset:") || hash.startsWith("user:")) {
        return this.otherEntitiesIcon();
      }
      return this.resourceIcon();
    },
  },
  methods: {
    resourceIcon() {
      return hashicon(this.hash, this.options).toDataURL();
    },
    otherEntitiesIcon() {
      const data = new Identicon(this.hash, {
        background: this.options.background || [0, 0, 0, 0],
        size: this.options.size || 60,
      }).toString();
      return `data:image/png;base64,${data}`;
    },
  },
};
</script>

<style scoped></style>
