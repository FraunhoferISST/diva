<template>
  <div class="loading-overlay" :class="{ loading: loading }">
    <div
      class="loader-container d-flex align-center justify-center"
      v-if="loading"
    >
      <div class="logo-container d-flex align-center justify-center">
        <!--<img class="logo-outer" src="@/assets/logo_parts/portal_logo2.svg" />-->
        <!--<img class="logo-inner" src="@/assets/logo_parts/logo_inner.svg" />-->
        <img
          class="logo-block block-3"
          src="@/assets/logo_parts/logo_block.svg"
        />
        <img
          class="logo-block block-2"
          src="@/assets/logo_parts/logo_block.svg"
        />
        <img
          class="logo-block block-1"
          src="@/assets/logo_parts/logo_block.svg"
        />
        <img
          class="logo-block block-0"
          src="@/assets/logo_parts/logo_block.svg"
        />
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import {} from "vue-content-loader";
export default {
  name: "LoadingStateOverlay",
  components: {},
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: () => ({
    load: false,
  }),
};
</script>

<style scoped lang="scss">
.loading-overlay {
  //min-width: 100px;
  //min-height: 100px;
  width: 100%;
  height: 100%;
  position: relative;
  transition: 0.3s;
  &.loading {
    .loader-container {
      //background-color: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }
  }
}

.loading-overlay-content {
  transition: 0.3s;
  &.loading {
    //filter: blur(3px);
    .loader-container {
      background-color: rgba(0, 0, 0, 1);
    }
  }
}

.loader-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.fake-content {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

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
  max-width: 150px;
  max-height: 150px;
  animation: show-loader 0.3s ease-in-out forwards;

  .logo-outer {
    width: 100%;
    animation: outer-rotation linear 1.5s infinite;
  }

  .logo-inner,
  .block-container,
  .logo-block {
    position: absolute;
  }

  .logo-inner {
    width: 50%;
    //@include animation-inner;
  }

  .block-container div {
    position: relative;
  }

  .logo-block {
    height: 50%;
    width: 50%;

    @for $block_count from 0 through 3 {
      &.block-#{$block_count} {
        top: $block-offset-base + ($block-offset * $block_count);
        @include animation-block($animation-delay-base * $block_count);
      }
    }
  }
}

@keyframes show-loader {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
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
