<template>
  <span class="custom-tag">{{ text }}</span>
</template>

<script>
export default {
  name: "CustomTag",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.custom-tag {
  transition: 0.3s;
  margin: 2px 3px;
  display: inline-block;
  padding: 0px 10px;
  //background-color: rgba($c_accent_primary, 0.2);
  border-radius: 20px;
  letter-spacing: 0.2rem;
  font-weight: bold;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  @include font-style(1rem, $font_body, bold, rgba($c_accent_primary, 0.8));
  @include gradient-primary(0.2, 0.5);
  &:hover {
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
  }
}

@media screen and (max-width: 959px) {
  .custom-tag {
    font-size: 1rem;
    padding: 0 6px;
  }
}
</style>
