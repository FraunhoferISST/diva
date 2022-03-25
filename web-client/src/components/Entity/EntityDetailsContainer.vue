<template>
  <section
    class="entity-details-container"
    v-scroll="onScroll"
    v-resize="updateOverviewContainerHeight"
  >
    <v-container
      class="pa-0 fill-height d-block relative"
      style="background-color: white"
    >
      <data-viewer :loading="loading" :updating="updating" :error="error">
        <template v-if="data">
          <div class="entity-details-overview">
            <v-container ref="overviewContainer" class="pa-0 pt-0 pb-0">
              <v-expand-transition>
                <v-container
                  v-show="tab.includes('/general')"
                  class="entity-details-overview-container px-12 pt-0 pb-0"
                >
                  <div class="pt-12">
                    <div class="d-flex justify-center align-center flex-column">
                      <entity-media :entity="{ ...data, title }" />
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
                        <h1 class="entity-details-title">{{ title }}</h1>
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
                            v-for="tag in tags"
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
                      class="entity-details-content d-flex justify-end pb-2 mt-5"
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
      </data-viewer>
      <entity-event-snackbar
        top
        absolute
        :message="message"
        :snackbar.sync="snackbar"
        :color="color"
        :timeout="timeout"
      >
        <v-btn
          class="ml-4"
          v-if="!eventData.reloadInstantly"
          text
          small
          color="white"
          :loading="updating"
          @click="reloadEntity"
        >
          Load changes
        </v-btn>
      </entity-event-snackbar>
      <v-container class="pa-0 pt-0 pb-12">
        <v-container class="entity-details-views-container pa-12">
          <slot> </slot>
        </v-container>
      </v-container>
    </v-container>
  </section>
</template>

<script>
import EntityProfilingButton from "@/components/Entity/EntityProfilingButton";
import EntityCreator from "@/components/Entity/EntityCreator";
import DotDivider from "@/components/Base/DotDivider";
import DateDisplay from "@/components/Base/DateDisplay";
import EntityLikeButton from "@/components/Entity/EntityLikeButton";
import EntityMedia from "@/components/Entity/EntityMedia/EntityMedia";
import { useSnackbar } from "@/composables/snackbar";
import { useEntity } from "@/composables/entity";
import { useBus } from "@/composables/bus";
import DataViewer from "@/components/DataFetchers/DataViewer";
import EntityEventSnackbar from "@/components/Entity/EntityEventSnackbar";
import { computed } from "@vue/composition-api";
import { useUser } from "@/composables/user";

export default {
  name: "EntityDetailsContainer",
  components: {
    EntityEventSnackbar,
    DataViewer,
    EntityMedia,
    EntityLikeButton,
    DateDisplay,
    DotDivider,
    EntityCreator,
    EntityProfilingButton,
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
  emits: ["reload"],
  setup(props) {
    const { addRecentlyViewed } = useUser();
    const { emit } = useBus();
    const {
      color,
      show: showSnackbar,
      close: closeSnackbar,
      message,
      snackbar,
      timeout,
    } = useSnackbar();
    const onEvent = ({ message, action, reloadInstantly }) => {
      if (reloadInstantly) {
        reloadEntity();
      }
      showSnackbar(message, {
        color: action === "updated" ? "#009374" : "error",
        timeout: reloadInstantly ? 2000 : 10000,
      });
    };
    const { load, loading, error, data, reload, updating, eventData, title } =
      useEntity(props.id, {
        reactive: true,
        onEvent,
      });
    load().then(() => addRecentlyViewed(data.value));
    const reloadEntity = () => {
      emit("reload");
      reload().then(() => {
        if (!eventData.value.reloadInstantly) {
          closeSnackbar();
        }
      });
    };
    return {
      reloadEntity,
      loading,
      updating,
      error,
      data,
      color,
      timeout,
      message,
      snackbar,
      eventData: computed(() => eventData.value ?? {}),
      showSnackbar,
      title,
      tags: computed(() =>
        [
          data.value.entityType,
          data.value.resourceType,
          data.value.assetType,
          data.value.mimeType,
        ]
          .filter((t) => t)
          .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t))
      ),
    };
  },
  data: () => ({
    menu: false,
    confirmationDialog: false,
    isLoading: false,
    scrollOffset: 0,
    overviewContainerHeight: null,
    tab: "",
  }),
  methods: {
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
  },
};
</script>

<style scoped lang="scss">
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
