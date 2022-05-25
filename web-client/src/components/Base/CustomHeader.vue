<template>
  <h2
    class="custom-header d-flex justify-space-between"
    :class="{ inverse: inverse }"
  >
    <slot>
      <span>
        {{ text }}
      </span>
    </slot>
    <span>
      <slot name="info"></slot>
    </span>
  </h2>
</template>

<script>
export default {
  name: "CustomHeader",
  props: {
    text: {
      type: String,
      required: false,
    },
    inverse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.custom-header {
  @include font-style(1.15rem, $font_body, bold, $font_primary_color);
  margin-bottom: 0;
  // letter-spacing: 0.1rem;
  word-break: break-all;
  &.inverse {
    color: $font_primary_color_inverse;
  }
}
</style>
