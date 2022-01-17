<template>
  <div
    class="btn-wrapper"
    :class="[{ round: round, rounded: rounded }, 'bg-' + color]"
  >
    <span></span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BtnWrapper",
  props: {
    rounded: {
      type: Boolean,
      required: false,
      default: false,
    },
    round: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: "primary",
    },
  },
};
</script>

<style scoped lang="scss">
.btn-wrapper {
  transition: 0.3s;
  display: inline-block;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  span {
    opacity: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  &.bg-primary {
    background-color: #e4f3fe; //rgba(202, 229, 255, 1);
    &:hover {
      background-color: #e6f3ff;
    }
  }
  &.bg-error {
    background-color: rgba(red, 0.1);
    &:hover {
      background-color: rgba(red, 0.2);
    }
  }
  &.round {
    border-radius: 50%;
  }
  &.rounded {
    border-radius: $border_radius;
  }
}
</style>
