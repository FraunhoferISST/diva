<template>
  <section
    class="entity-details-container"
    v-scroll="onScroll"
    v-resize="updateOverviewContainerHeight"
  >
    <v-container
      class="pa-0 fill-height d-block"
      style="background-color: white"
    >
      <entity-base-data-fetcher :id="id" style="min-height: 55px">
        <template #default="{ data }">
          <div class="entity-details-overview">
            <v-container ref="overviewContainer" class="pa-0 pt-0 pb-0">
              <v-expand-transition>
                <v-container
                  v-show="tab.includes('/general')"
                  class="entity-details-overview-container px-12 pt-0 pb-0"
                >
                  <div class="pt-12">
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
                  <div class="pt-12">
                    <div class="entity-details-header">
                      <div>
                        <h1 class="entity-details-title">
                          {{ data.title }}
                        </h1>
                        <!--                    <info-block-value
                          style="opacity: 0.4"
                          v-if="data.uniqueFingerprint"
                        >
                          #{{ data.uniqueFingerprint }}
                        </info-block-value>-->
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
                        <div class="d-flex justify-start align-center mt-4">
                          <entity-creator
                            v-if="data.creatorId"
                            :creator-id="data.creatorId"
                            :created-at="data.created"
                          />
                          <div
                            v-if="
                              data.modified && data.modified !== data.created
                            "
                            class="d-flex align-center"
                          >
                            <dot-divider class="mx-3" size="2px" />
                            <span>last updated</span>
                            <date-display class="ml-2" :date="data.modified" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <v-menu left bottom rounded="lg" min-width="200">
                          <template #activator="{ on, attrs }">
                            <v-btn
                              color="primary"
                              icon
                              v-bind="attrs"
                              v-on="on"
                            >
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
                      <entity-like-button :id="id" />
                      <entity-profiling-button class="ml-4" :id="id" />
                    </div>
                  </div>
                </v-container>
              </v-expand-transition>
              <div class="entity-details-nav-container relative">
                <div
                  class="entity-details-nav"
                  :class="{
                    fixed:
                      overviewContainerHeight &&
                      scrollOffset > overviewContainerHeight - 55,
                  }"
                >
                  <v-container class="fluid pa-0">
                    <v-tabs
                      v-model="tab"
                      show-arrows
                      background-color="white"
                      center-active
                      grow
                    >
                      <v-tabs-slider></v-tabs-slider>
                      <v-tab
                        :to="{ name: link.name }"
                        v-for="(link, i) in links"
                        :key="i"
                      >
                        <v-icon small class="mr-md-2">
                          {{ link.icon }}
                        </v-icon>
                        <span class="d-none d-md-inline">{{ link.title }}</span>
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
    </v-container>
  </section>
</template>

<script>
import EntityBaseDataFetcher from "@/components/DataFetchers/EntityBaseDataFetcher";
import EntityProfilingButton from "@/components/Entity/EntityProfilingButton";
import EntityCreator from "@/components/Entity/EntityCreator";
import DotDivider from "@/components/Base/DotDivider";
import DateDisplay from "@/components/Base/DateDisplay";
import EntityLikeButton from "@/components/Entity/EntityLikeButton";
export default {
  name: "EntityDetailsContainer",
  components: {
    EntityLikeButton,
    DateDisplay,
    DotDivider,
    EntityCreator,
    EntityProfilingButton,
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
    overviewContainerHeight: null,
    tab: "",
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
      this.updateOverviewContainerHeight();
      this.scrollOffset = e.target.scrollingElement.scrollTop;
    },
    updateOverviewContainerHeight() {
      this.$nextTick(() => {
        this.overviewContainerHeight =
          this.$refs.overviewContainer?.clientHeight ?? null;
      });
    },
  },
  mounted() {
    this.updateOverviewContainerHeight();
    this.$store.dispatch("addRecentlyViewed", { id: this.id });
  },
};
</script>

<style scoped lang="scss">
.entity-details-container {
  //background-color: $bg_card;
}
.entity-details-overview-container {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 20px;
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
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
