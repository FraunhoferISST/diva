<template>
  <v-container class="fill-height pa-0 relative" fluid>
    <div class="login-page-container full-width fill-height">
      <div class="blob blob-tl"></div>
      <div class="blob blob-bl"></div>
      <div class="login-page-left-container d-flex justify-center align-center">
        <div class="actions-container">
          <div>
            <h1 class="info-header">Setup your Account</h1>
            <p class="mt-8 mb-10">
              You will be redirected to another trusted site where you can log
              in with your data or create a new account.
            </p>
            <v-container class="pa-0" fluid>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    class="gprimary"
                    large
                    color="primary"
                    block
                    rounded
                    @click="redirectToLogin"
                  >
                    Login
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-divider />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    outlined
                    large
                    color="primary"
                    block
                    rounded
                    @click="redirectToLogout"
                  >
                    Create new account
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
      <div class="login-page-right-container relative">
        <div class="login-page-bg fill-height"></div>
        <div class="d-flex justify-center align-center fill-height">
          <div class="info-container">
            <h1 class="info-header">Bring your data to shine with DIVA</h1>
            <p class="mt-8">
              Dynamic and extensible data management approach that scales with
              the dimensions and complexity of the resources in your
              organisation. Process your resource with AI empowered workflows to
              bring out the hidden potential of the data
            </p>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import keycloak from "@/api/keycloak";
export default {
  name: "Login",
  methods: {
    redirectToLogin() {
      keycloak.login();
    },
    redirectToLogout() {
      keycloak.register();
    },
  },
};
</script>

<style scoped lang="scss">
.login-page-container {
  display: grid;
  grid-template-columns: 1fr 700px;
}

.login-page-bg {
  // Colors
  $bg-color: blue;
  $dot-color: rgb(255, 255, 255, 0.7);

  // Dimensions
  $dot-size: 1px;
  $dot-space: 22px;

  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}
.info-container {
  position: relative;
  z-index: 20;
  max-width: 500px;
  height: 350px;
  h1.info-header {
    font-family: Montserrat;
    font-size: 3.2rem !important;
    color: white;
  }
  p {
    font-size: 1.2rem;
    color: #eeeeee;
  }
}

.actions-container {
  max-width: 500px;
  height: 350px;
  h1.info-header {
    font-family: Montserrat;
    font-size: 3.2rem !important;
  }
  p {
    font-size: 1.2rem;
  }
}
.blob {
  opacity: 1;
  position: absolute;
  width: 400px;
  height: 400px;
  background-size: cover;
  background-repeat: no-repeat;
}
.blob-tl {
  top: -100px;
  right: 550px;
  z-index: 10;
  background-image: url("data:image/svg+xml;utf8, %3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' %3E %3Cdefs%3E %3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='25' height='25' viewBox='0 0 100 100' fill='%230000FF' %3E %3Ccircle cx='50' cy='50' r='12.5' /%3E %3C/pattern%3E %3CclipPath id='shape'%3E %3Cpath fill='currentColor' d='M748.5,602Q743,704,642.5,720Q542,736,440.5,758Q339,780,331.5,672Q324,564,258,476Q192,388,235,251.5Q278,115,412.5,175Q547,235,647,264Q747,293,750.5,396.5Q754,500,748.5,602Z'%3E%3C/path%3E %3C/clipPath%3E %3C/defs%3E %3Cg clip-path='url(%23shape)'%3E %3Cpath fill='url(%23pattern)' d='M748.5,602Q743,704,642.5,720Q542,736,440.5,758Q339,780,331.5,672Q324,564,258,476Q192,388,235,251.5Q278,115,412.5,175Q547,235,647,264Q747,293,750.5,396.5Q754,500,748.5,602Z' /%3E %3C/g%3E %3C/svg%3E");
}
.blob-bl {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  background-image: url("data:image/svg+xml;utf8, %3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' %3E %3Cdefs%3E %3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='25' height='25' viewBox='0 0 100 100' fill='%230000FF' %3E %3Ccircle cx='50' cy='50' r='12.5' /%3E %3C/pattern%3E %3CclipPath id='shape'%3E %3Cpath fill='currentColor' d='M869,639Q831,778,689,772Q547,766,448.5,763Q350,760,206.5,709.5Q63,659,138,527.5Q213,396,269,296Q325,196,455.5,103.5Q586,11,650.5,165Q715,319,811,409.5Q907,500,869,639Z'%3E%3C/path%3E %3C/clipPath%3E %3C/defs%3E %3Cg clip-path='url(%23shape)'%3E %3Cpath fill='url(%23pattern)' d='M869,639Q831,778,689,772Q547,766,448.5,763Q350,760,206.5,709.5Q63,659,138,527.5Q213,396,269,296Q325,196,455.5,103.5Q586,11,650.5,165Q715,319,811,409.5Q907,500,869,639Z' /%3E %3C/g%3E %3C/svg%3E");
}
</style>
