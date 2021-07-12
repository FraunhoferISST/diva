<template>
  <div class="profiling-done-container">
    <div class="liquid-container">
      <div class="liquid-elements-container">
        <div class="liquid-elements">
          <div
            class="liquid1"
            :style="{
              opacity: opacityLiquid1,
              animationDuration: `${speedLiquid1}s`,
              backgroundImage:
                'url(' + require('@/assets/create/w_1_primary.png') + ')',
            }"
          ></div>
          <div
            class="liquid2"
            :style="{
              opacity: opacityLiquid2,
              animationDuration: `${speedLiquid2}s`,
              backgroundImage:
                'url(' + require('@/assets/create/w_2_primary.png') + ')',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Waves",
  props: {
    opacity: {
      type: Number,
      required: false,
      default: 0.1,
    },
    speed: {
      type: Number,
      required: false,
      default: 2,
    },
  },
  computed: {
    opacityLiquid1() {
      return (this.opacity - 0.05).toFixed(2);
    },
    opacityLiquid2() {
      return this.opacity;
    },
    speedLiquid1() {
      return (this.speed - 0.5).toFixed(1);
    },
    speedLiquid2() {
      return this.speed;
    },
  },
};
</script>

<style scoped lang="scss">
.profiling-done-container {
  height: 90%;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: transparent;
  animation: 1s background ease-in-out forwards;
  max-height: 80vh;
  //overflow: hidden;
}

.liquid-container {
  margin-top: 3%;
  background-repeat: repeat-x;

  .liquid-elements-container {
    width: 100%;
    height: 100%;
  }

  .liquid-elements {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    animation: wave-up 5s ease-in-out forwards;
  }

  .liquid-text {
    position: relative;
    z-index: 2;
    color: white;
    font-size: 3rem;
  }
}

.liquid1,
.liquid2 {
  position: absolute;
  height: 100%;
  width: 100%;
  background-repeat: repeat-x;
}

.liquid1 {
  opacity: 0.05;
  animation: wave-move 2s linear infinite;
  animation-delay: 1s;
}

.liquid2 {
  opacity: 0.1;
  height: 100%;
  animation: wave-move2 2.5s linear infinite;
  animation-delay: 1s;
}

@keyframes wave-move {
  0% {
    background-position: left 0 top 0px;
  }
  50% {
    background-position: left 1266px top 0px;
  }
  100% {
    background-position: left 2532px top 0px;
  }
}

@keyframes wave-move2 {
  0% {
    background-position: left 0 top 0px;
  }
  50% {
    background-position: left 1266px top 0px;
  }
  100% {
    background-position: left 2532px top 0px;
  }
}

@keyframes wave-up {
  0% {
    height: 0;
  }
  100% {
    height: 120%;
  }
}

@media screen and (max-width: 599px) {
  .profiling-done-container {
    max-height: 80vh;
    overflow: auto;
  }
}
</style>
