<template>
  <v-container class="fill-height" id="login-container" fluid>
    <div id="login-background"></div>
    <v-row class="fill-height" style="z-index: 2">
      <v-col
        class="d-flex justify-center align-center"
        cols="12"
        sm="12"
        md="12"
        lg="8"
        xl="8"
        offset="0"
        offset-sm="0"
        offset-md="0"
        offset-lg="2"
      >
        <v-row no-gutters id="login-forms-container">
          <v-col cols="6">
            <fade-in>
              <login-form v-if="currentSliderPosition === 'right'" />
            </fade-in>
          </v-col>
          <v-col cols="6">
            <fade-in>
              <signup-form v-if="currentSliderPosition === 'left'" />
            </fade-in>
          </v-col>
          <slider position="right" @switch="onSliderSwitch" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from "@/components/Login/LoginForm";
import SignupForm from "@/components/Login/SignupForm";
import Slider from "@/components/Login/Slider";
import FadeIn from "@/components/Transitions/FadeIn";
export default {
  name: "Login",
  components: { FadeIn, Slider, SignupForm, LoginForm },
  data: () => ({
    currentSliderPosition: "right",
  }),
  methods: {
    onSliderSwitch(newPosition) {
      this.currentSliderPosition = newPosition;
    },
  },
};
</script>

<style scoped lang="scss">
#login-container {
  position: relative;
}
#login-background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  filter: brightness(0.6) saturate(2);
  background-image: url("../assets/login/background_planet.jpg");
  background-position: center;
  background-size: cover;
}
#login-forms-container {
  position: relative;
  min-height: 70vh;
  @include border-radius();
  overflow: hidden;
  background-color: white;
}
</style>
