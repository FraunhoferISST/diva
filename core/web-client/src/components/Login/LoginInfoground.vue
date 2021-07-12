<template>
  <v-row
    class="fill-height"
    id="login-info-container"
    style="position: relative"
    align="center"
  >
    <div id="login-info-background" class="fill-height"></div>
    <v-col class="pa-4" cols="12" style="z-index: 1">
      <div class="text-center">
        <img
          id="login-info-diva-logo"
          height="200px"
          width="400px"
          :src="require('@/assets/diva_logo_typo.svg')"
        />
      </div>
      <p>
        {{ local("card_text") }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "LoginInfoground",
  methods: {
    local(string) {
      return this.$t(`login.${string}`);
    },
  },
};
</script>

<style scoped lang="scss">
#login-info-container {
  overflow: hidden;
  position: relative;
  background-size: cover;
  h1 {
    @include font-style(2em, $font_header, bold, white);
    letter-spacing: 0.3em;
  }
  p {
    @include font-style(1.5em, $font_body, normal, white);
    letter-spacing: 0.1em;
  }
}
#login-info-diva-logo {
  width: 250px;
}
#login-info-background {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  filter: brightness(0.7) saturate(2);
  z-index: 0;
  background-image: url("../../assets/login/background_section.jpg");
  background-position: center;
  background-size: cover;
}
</style>
