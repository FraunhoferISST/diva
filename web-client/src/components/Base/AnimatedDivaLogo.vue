<template>
  <div class="logo-container d-flex align-center justify-center">
    <img class="logo-inner" src="@/assets/logo_parts/logo_inner.svg" />
    <img
      class="logo-block block-3"
      :class="{ animated: animated }"
      src="@/assets/logo_parts/logo_block.svg"
    />
    <img
      class="logo-block block-2"
      :class="{ animated: animated }"
      src="@/assets/logo_parts/logo_block.svg"
    />
    <img
      class="logo-block block-1"
      :class="{ animated: animated }"
      src="@/assets/logo_parts/logo_block.svg"
    />
    <img
      class="logo-block block-0"
      :class="{ animated: animated }"
      src="@/assets/logo_parts/logo_block.svg"
    />
  </div>
</template>

<script>
export default {
  name: "AnimatedDivaLogo",
  props: {
    animated: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style scoped lang="scss">
$block-offset-base: 13%;
$block-offset: 8%;
$animation-delay-base: 0.2s;

@mixin animation-block($delay: 0s) {
  animation: block-animation ease-in-out 1.5s infinite;
  animation-delay: $delay;
}

@mixin animation-inner() {
  animation: inner-animation ease-in-out 5s infinite;
}

.logo-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;

  .logo-outer {
    width: 100%;
    &.animated {
      animation: outer-rotation linear 1.5s infinite;
    }
  }

  .logo-inner,
  .block-container,
  .logo-block {
    position: absolute;
  }

  .logo-inner {
    width: 100%;
    //@include animation-inner;
  }

  .block-container div {
    position: relative;
  }

  .logo-block {
    height: 50%;
    width: 100%;
    max-height: 50%;
    max-width: 100%;

    @for $block_count from 0 through 3 {
      &.block-#{$block_count} {
        top: $block-offset-base + ($block-offset * $block_count);
        &.animated {
          @include animation-block($animation-delay-base * $block_count);
        }
      }
    }
  }
}

@keyframes block-animation {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-12%);
  }

  50% {
    transform: translateX(0);
  }
}

@keyframes outer-rotation {
  100% {
    transform: rotate(360deg);
  }
}
</style>
