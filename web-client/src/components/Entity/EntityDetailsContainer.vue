<template>
  <section class="entity-details-container pb-12" v-scroll="onScroll">
    <entity-base-data-fetcher :id="id">
      <template #default="{ data }">
        <div class="entity-details-overview">
          <v-container class="pa-0 pt-12 pb-0">
            <v-container
              class="entity-details-overview-container px-12 pt-12 pb-0"
            >
              <div>
                <div class="d-flex justify-center align-center flex-column">
                  <div
                    class="entity-details-image d-flex justify-center align-center"
                  >
                    <span>
                      {{ (data.title || "").charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="pt-2">
                    <v-rating
                      color="orange"
                      readonly
                      small
                      dense
                      :value="data.rating"
                    >
                    </v-rating>
                  </div>
                </div>
              </div>
              <div>
                <div class="entity-details-header">
                  <div class="d-flex flex-column justify-center">
                    <h1 class="entity-details-title">
                      {{ data.title }} Das Element wird aus dem normalen Fluss
                      gelöst und unabhängig verschoben. Dabei können
                    </h1>
                    <info-block-value
                      style="opacity: 0.4"
                      v-if="data.uniqueFingerprint"
                    >
                      #{{ data.uniqueFingerprint }}
                    </info-block-value>
                    <div class="mt-2">
                      <v-chip
                        class="mr-2"
                        small
                        label
                        color="#EFF3F7FF"
                        v-for="tag in getTags(data)"
                        :key="tag"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                  </div>
                  <div>
                    <v-menu left bottom rounded="lg" min-width="200">
                      <template #activator="{ on, attrs }">
                        <v-btn color="primary" icon v-bind="attrs" v-on="on">
                          <v-icon> more_vert </v-icon>
                        </v-btn>
                      </template>

                      <v-list dense>
                        <v-list-item @click="showConfirmationDialog">
                          <v-list-item-icon>
                            <v-icon dense color="error">delete</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
                <div
                  class="entity-details-content d-flex justify-end pb-8 mt-5"
                >
                  <v-btn dark class="gprimary" rounded>
                    Initialize profiling
                  </v-btn>
                </div>
              </div>
            </v-container>
            <div class="entity-details-nav-container relative">
              <div
                class="entity-details-nav"
                :class="{ fixed: scrollOffset > 260 }"
              >
                <v-container class="fluid pa-0">
                  <v-tabs
                    show-arrows
                    background-color="white"
                    center-active
                    grow
                  >
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab
                      :to="{ name: link.name }"
                      v-for="link in links"
                      :key="link.name"
                    >
                      {{ link.title }}
                    </v-tab>
                  </v-tabs>
                  <div class="entity-details-divider"></div>
                </v-container>
              </div>
            </div>
          </v-container>
        </div>
      </template>
    </entity-base-data-fetcher>
    <v-container class="pa-0 pt-0 pb-12">
      <v-container class="entity-details-views-container pa-12">
        <slot> </slot>
      </v-container>
    </v-container>
  </section>
</template>

<script>
import EntityBaseDataFetcher from "@/components/DataFetchers/EntityBaseDataFetcher";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
export default {
  name: "EntityDetailsContainer",
  components: {
    InfoBlockValue,
    EntityBaseDataFetcher,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    links: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    menu: false,
    confirmationDialog: false,
    isLoading: false,
    snackbar: false,
    snackbarText: "",
    scrollOffset: 0,
  }),
  methods: {
    getTags(data) {
      return [data.entityType, data.resourceType, data.assetType, data.mimeType]
        .filter((t) => t)
        .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t));
    },
    showConfirmationDialog() {
      this.confirmationDialog = true;
    },
    onScroll(e) {
      console.log(e.target.scrollingElement.scrollTop);
      this.scrollOffset = e.target.scrollingElement.scrollTop;
    },
  },
};
</script>

<style scoped lang="scss">
.entity-details-overview-container {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 20px;
}
.entity-details-overview-container,
.entity-details-views-container {
  background-color: $bg_card;
  @include border-radius($border_radius, $border_radius, 0, 0);
}
.entity-details-views-container {
  @include border-radius(0, 0, $border_radius, $border_radius);
}
.entity-details-header {
  display: grid;
  grid-template-columns: 1fr 40px;
  gap: 24px;
}
.entity-details-image {
  border-radius: 50%;
  height: 100px;
  width: 100px;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.4rem !important;
  background-color: $bg_card_secondary;
}
.entity-details-title {
  font-family: Montserrat;
  font-size: 1.5rem !important;
}
.entity-details-content {
  //padding-left: 80px;
}
.entity-details-divider {
  width: 100%;
  height: 2px;
  background-color: $bg_card_secondary;
}
.entity-details-nav-container {
  height: 55px;
  a.v-tab {
    font-weight: bold;
    font-size: 1rem;
    //display: inline-block;
    //padding-top: 20px;
    @include border-radius();
    &:before {
      @include border-radius($border_radius, $border_radius, 0, 0);
    }
  }
}
.entity-details-nav {
  width: 100%;
  z-index: 2;
  &.fixed {
    padding-left: 70px;
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
