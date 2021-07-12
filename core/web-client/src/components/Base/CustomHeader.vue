<template>
  <h2 v-if="text" class="header" :class="{ inverse: inverse }">{{ text }}</h2>
</template>

<script>
export default {
  name: "CustomHeader",
  props: {
    text: {
      type: String,
      required: true,
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
.header {
  @include font-style(1.15rem, $font_body, bold, $font_primary_color);
  margin-bottom: 0;
  // letter-spacing: 0.1rem;
  &.inverse {
    color: $font_primary_color_inverse;
  }
}
</style>
