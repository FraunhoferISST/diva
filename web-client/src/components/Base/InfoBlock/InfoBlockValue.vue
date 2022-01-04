<template>
  <span class="info-block-value">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: "InfoBlockValue",
};
</script>

<style scoped lang="scss">
.info-block-value {
  @include font-style(1rem, $font_body, bold, $font_secondary_color);
}
</style>
