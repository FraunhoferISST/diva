<template>
  <v-container class="ma-0" fluid style="background-color: white">
    <v-row class="fill-height" no-gutters>
      <v-col
        cols="12"
        md="10"
        lg="6"
        xl="6"
        offset="0"
        offset-md="1"
        offset-lg="3"
        class="fill-height d-flex justify-center align-center"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
            class="d-flex"
            v-for="item in items"
            :key="item.title"
          >
            <router-link
              :to="{ name: item.routeName }"
              class="full-width fill-height"
            >
              <div class="select-card pa-10 fill-height relative">
                <div class="blob"></div>
                <h2 class="select-card-title">{{ item.title }}</h2>
                <div class="select-card-description mt-2">
                  {{ item.description }}
                </div>
              </div>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CreateSelectEntity",
  components: {},
  data: () => ({
    items: [
      {
        title: "Import new resources",
        description: "Connect DIVA with you data sources or upload files",
        icon: "resource.svg",
        routeName: "create_resource",
      },
      {
        title: "Create new asset",
        description: "Connect your resources together",
        icon: "asset.svg",
        color: "alternative",
        routeName: "create_asset",
      },
      /*{
        title: "Add new process",
        description: "We will define this in the future",
        icon: "resource.svg",
        route: "resource",
      },
      {
        title: "Add new entity",
        description: "We will define this in the future",
        icon: "resource.svg",
        route: "resource",
      },*/
    ],
  }),
};
</script>

<style scoped lang="scss">
.select-card {
  width: 100%;
  border-radius: 10px;
  border: 2px solid $bg_card_secondary;
  transition: 0.5s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    background-color: $bg_card_secondary;
  }
  .blob {
    opacity: 0.8;
    position: absolute;
    width: 250px;
    height: 250px;
    background-size: cover;
    background-repeat: no-repeat;
    top: 40px;
    right: -140px;
    z-index: 1;
    background-image: url("data:image/svg+xml;utf8, %3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' %3E %3Cdefs%3E %3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='25' height='25' viewBox='0 0 100 100' fill='%2317196D' %3E %3Ccircle cx='25' cy='25' r='8.333333333333334' /%3E %3Ccircle cx='75' cy='75' r='8.333333333333334' /%3E %3C/pattern%3E %3CclipPath id='shape'%3E %3Cpath fill='currentColor' d='M853.5,604Q787,708,705,793Q623,878,486,922Q349,966,267.5,847Q186,728,167.5,614Q149,500,224,427Q299,354,330.5,215Q362,76,490,106Q618,136,753,177Q888,218,904,359Q920,500,853.5,604Z'%3E%3C/path%3E %3C/clipPath%3E %3C/defs%3E %3Cg clip-path='url(%23shape)'%3E %3Cpath fill='url(%23pattern)' d='M853.5,604Q787,708,705,793Q623,878,486,922Q349,966,267.5,847Q186,728,167.5,614Q149,500,224,427Q299,354,330.5,215Q362,76,490,106Q618,136,753,177Q888,218,904,359Q920,500,853.5,604Z' /%3E %3C/g%3E %3C/svg%3E");
  }
}
.select-card-title {
  color: $font_primary_color;
  font-size: 2rem;
  font-weight: bolder;
  font-family: Montserrat;
}
.select-card-description {
  font-size: 1.1rem;
}
</style>
