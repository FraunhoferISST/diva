<template>
  <v-container class="ma-0" fluid>
    <v-row class="fill-height" align="center" no-gutters>
      <v-col
        cols="12"
        sm="12"
        md="10"
        lg="6"
        xl="6"
        offset="0"
        offset-sm="0"
        offset-md="1"
        offset-lg="3"
      >
        <v-row>
          <v-col
            cols="12"
            sm="6"
            v-for="(item, i) in items"
            :key="i"
            class="text-center"
          >
            <router-link :to="{ name: item.routeName }">
              <div class="create-entity flex">
                <div>
                  <template slot="body">
                    <h2 class="create-entity-title mb-4">
                      {{ item.title }}
                    </h2>
                    <p class="py-0" v-if="item.icon">
                      <img
                        width="150px"
                        height="150px"
                        :src="require('@/assets/create/' + item.icon)"
                      />
                    </p>
                    <p class="create-entity-description ma-0">
                      {{ item.description }}
                    </p>
                  </template>
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
import ColoredCard from "@/components/Base/ColoredCard";
export default {
  name: "CreateSelectEntity",
  components: { ColoredCard },
  data: () => ({
    items: [
      {
        title: "Add new resources",
        description:
          "Add new files to your DIVA or connect to a database and let profile your data",
        icon: "select_resource_img.svg",
        color: "primary",
        routeName: "create_resource",
      },
      {
        title: "Create new asset",
        description: "Connect your resources together",
        icon: "select_asset_img.svg",
        color: "alternative",
        routeName: "create_asset",
      },
      /*{
        title: "Add new process",
        description: "We will define this in the future",
        icon: "",
        color: "red",
        route: "resource"
      },
      {
        title: "Add new entity",
        description: "We will define this in the future",
        icon: "",
        color: "green",
        route: "resource"
      }*/
    ],
  }),
};
</script>

<style scoped lang="scss">
.create-entity {
  min-height: 200px;
  height: 100%;
  & > div {
    height: 100%;
  }
}
.create-entity-title {
  @include font-style(1.9rem, $font_header, bold, $font_primary_color_inverse);
}
.create-entity-description {
  @include font-style(1rem, $font_header, bold, $font_primary_color_inverse);
}
</style>
