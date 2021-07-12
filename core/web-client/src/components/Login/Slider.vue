<template>
  <div class="slider-container text-center" :class="[pos]">
    <colored-card class="fill-height" :padding="false" :rounded="false">
      <div
        class="slider-content pa-10 fill-height d-flex justify-center align-center"
        slot="body"
      >
        <div class="slider-animation-container">
          <waves :speed="10" :opacity="0.5" />
        </div>
        <slider-content-transition :value="pos">
          <div class="slider-content-items">
            <h2 class="slider-content-header mb-5">
              {{ content.header }}
            </h2>
            <p class="slider-content-text mb-5">
              {{ content.text }}
            </p>

            <p class="slider-content-or mb-5">or</p>

            <button class="slider-button px-10" @click="switchPosition">
              {{ content.button }}
            </button>
          </div>
        </slider-content-transition>
      </div>
    </colored-card>
  </div>
</template>

<script>
import ColoredCard from "@/components/Base/ColoredCard";
import SliderContentTransition from "@/components/Transitions/SliderContentTransition";
import Waves from "@/components/Animations/Waves";
export default {
  name: "Slider",
  components: { Waves, SliderContentTransition, ColoredCard },
  props: {
    position: {
      type: String,
      required: true,
      default: "left",
      validator: (position) => ["left", "right"].includes(position),
    },
  },
  data() {
    return {
      pos: this.position,
    };
  },
  watch: {
    position(val) {
      this.pos = val;
    },
  },
  computed: {
    content() {
      if (this.pos === "left") {
        return {
          header: "Join DIVA",
          text:
            "New here! Create an account and join DIVA - an innovative way of thinking your Data Management",
          button: "login",
        };
      } else {
        return {
          header: "Welcome back",
          text: "Login with your data to DIVA and enjoy it",
          button: "create new account",
        };
      }
    },
  },
  methods: {
    switchPosition() {
      if (this.pos === "left") {
        this.pos = "right";
      } else {
        this.pos = "left";
      }
      this.$emit("switch", this.pos);
    },
  },
};
</script>

<style scoped lang="scss">
.slider-container {
  height: 100%;
  width: 50%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;
  color: white;
  &.left {
    animation: switch-left 1s ease-in-out forwards;
  }
  &.right {
    animation: switch-right 1s ease-in-out forwards;
  }
}

.slider-content {
  width: 100%;
  position: relative;
  .slider-content-items {
    max-width: 400px;
  }
}

.slider-content-header {
  letter-spacing: 0.15rem;
  @include font-style(
    $size: 2.5rem,
    $family: $font_body,
    $weight: bolder,
    $color: $font_primary_color_inverse
  );
}

.slider-content-text {
  letter-spacing: 0.1rem;
  @include font-style(
    $size: 1rem,
    $family: $font_body,
    $weight: bolder,
    $color: white
  );
}

.slider-content-or {
  @include font-style(
    $size: 1.3rem,
    $family: $font_body,
    $weight: bolder,
    $color: white
  );
}

.slider-animation-container {
  position: absolute;
  height: 35%;
  width: 100%;
  bottom: 0;
  left: 0;
}

button.slider-button {
  transition: 0.3s;
  width: 100%;
  height: 40px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 25px;
  outline: none;
  color: white;
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 2px solid white;
  &:hover {
    border: 2px solid #2504ff;
    //box-shadow: 0 0 10px 2px rgba(0, 69, 255, 0.5) !important;
  }
}

@keyframes switch-right {
  0% {
    left: 0;
    width: 50%;
  }
  50% {
    left: 10%;
    width: 90%;
  }
  100% {
    left: 50%;
    width: 50%;
  }
}

@keyframes switch-left {
  0% {
    left: 50%;
    width: 50%;
  }
  50% {
    left: 0;
    width: 90%;
  }
  100% {
    left: 0;
    width: 50%;
  }
}

@media screen and (max-width: 959px) {
}
</style>
