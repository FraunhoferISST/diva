<template>
  <h3 class="sub-header">
    {{ text }}
    <slot></slot>
  </h3>
</template>

<script>
export default {
  name: "SubHeader",
  props: ["text"],
};
</script>

<style scoped lang="scss">
.sub-header {
  font-size: 0.9rem;
  font-family: $font_header;
  color: $font_secondary_color;
  letter-spacing: 0.06rem;
  font-weight: bold;
}
</style>
