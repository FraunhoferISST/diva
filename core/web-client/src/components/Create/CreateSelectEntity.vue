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
              <div class="select-card pa-10 fill-height">
                <h2 class="select-card-title">{{ item.title }}</h2>
                <div class="select-card-description mt-2">
                  {{ item.description }}
                </div>
                <div class="select-card-image">
                  <div>
                    <img
                      width="90px"
                      :src="require('@/assets/create/' + item.icon)"
                    />
                  </div>
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
        color: "primary",
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
        color: "red",
        route: "resource",
      },
      {
        title: "Add new entity",
        description: "We will define this in the future",
        icon: "resource.svg",
        color: "green",
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
.select-card-image {
  position: absolute;
  right: -20px;
  top: 0;
}
</style>
