<template>
  <h5 class="info-block-title">
    <slot></slot>
  </h5>
</template>

<script>
export default {
  name: "InfoBlockTitle",
};
</script>

<style scoped lang="scss">
.info-block-title {
  @include font-style(1rem, $font_body, bold, $font_primary_color);
  margin-bottom: 0;
}
</style>
