<template>
  <span :style="{ width: size, height: size }" class="dot-divider"></span>
</template>

<script>
export default {
  name: "DotDivider",
  props: {
    size: {
      type: String,
      default: "2px",
    },
  },
};
</script>

<style lang="scss" scoped>
.dot-divider {
  background-color: $font_secondary_color;
  display: inline-block;
  height: 2px;
  width: 2px;
}
</style>
