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
            <entity-controls :show.sync="showControls" :entity="data" />
            <v-container ref="overviewContainer" class="pa-0 pt-0 pb-0">
              <v-expand-transition>
                <v-container
                  v-if="tab.includes('/general')"
                  class="entity-details-overview-container px-3 px-md-12 pt-0 pb-0"
                >
                  <div class="pt-3 pt-md-12">
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
                  <div class="pt-3 pt-md-12">
                    <div class="entity-details-header">
                      <div>
                        <h1 class="entity-details-title">{{ title }}</h1>
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
                        <div class="d-block d-md-flex justify-start mt-4">
                          <entity-creator
                            :id="data.id"
                            :created-at="data.createdAt"
                          />
                          <div
                            v-if="
                              data.modifiedAt &&
                              data.modifiedAt !== data.createdAt
                            "
                            class="d-block d-md-flex align-center"
                          >
                            <dot-divider
                              class="mx-3 d-none d-md-block"
                              size="2px"
                            />
                            <div class="mt-2 mt-md-0">
                              <span>last updated</span>
                              <date-display :date="data.modifiedAt" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <v-btn
                          color="primary"
                          icon
                          @click="showControls = true"
                        >
                          <v-icon> more_vert </v-icon>
                        </v-btn>
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
            </v-container>
          </div>
          <div class="entity-details-nav-container">
            <div
              class="entity-details-nav"
              :class="{
                fixed: scrollOffset > overviewContainerHeight,
              }"
            >
              <v-container class="fluid pa-0">
                <v-tabs
                  v-model="tab"
                  background-color="white"
                  center-active
                  show-arrows
                  grow
                >
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab
                    :to="{ name: link.name }"
                    v-for="(link, i) in routes"
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
        </template>
      </data-viewer>
      <entity-event-snackbar
        top
        fixed
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
        <v-container class="entity-details-views-container pa-3 pa-md-12">
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
import { computed, ref } from "@vue/composition-api";
import { useUser } from "@/composables/user";
import ConfirmationDialog from "@/components/Base/ConfirmationDialog";
import EntityFieldCreationDialog from "@/components/Entity/EntityFieldCreationDialog";
import EntityControls from "@/components/Entity/EntityControls";

export default {
  name: "EntityDetailsContainer",
  components: {
    EntityControls,
    EntityFieldCreationDialog,
    ConfirmationDialog,
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
    routes: {
      type: Array,
      required: true,
    },
  },
  emits: ["reload"],
  setup(props, { root }) {
    const confirmationDialog = ref(false);
    const fieldCreationDialog = ref(false);
    const menu = ref(false);
    const tab = ref("");
    const showControls = ref(false);

    const { addRecentlyViewed, isAdmin } = useUser();
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
    const {
      load,
      loading,
      error,
      data,
      reload,
      updating,
      eventData,
      title,
      deleteEntity,
      deleteLoading,
      deleteError,
    } = useEntity(props.id, {
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
      showControls,
      confirmationDialog,
      fieldCreationDialog,
      tab,
      menu,
      loading,
      updating,
      error,
      data,
      color,
      timeout,
      message,
      snackbar,
      deleteError,
      deleteLoading,
      title,
      isAdmin,
      eventData: computed(() => eventData.value ?? {}),
      tags: computed(() =>
        [
          data.value.entityType,
          data.value.resourceType,
          data.value.systemEntityType,
          data.value.assetType,
          data.value.mimeType,
        ]
          .filter((t) => t)
          .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t))
      ),
      schemaScope: computed(() => [
        !data.value
          ? []
          : Object.entries({
              mimeType: data.value.mimeType,
              resourceType: data.value.resourceType,
              systemEntityType: data.value.systemEntityType,
              assetType: data.value.assetType,
              entityType: data.value.entityType,
            })
              .map(([key, value]) => ({ key: key, value: value }))
              .filter(({ value }) => value)[0],
      ]),
      showSnackbar,
      deleteEnt: () =>
        deleteEntity().then(() => {
          if (deleteError.value) {
            showSnackbar(deleteError.value, { color: "error" });
          } else {
            showSnackbar("Entity deleted", { color: "success" });
            confirmationDialog.value = false;
            setTimeout(() => root.$router.push({ name: "search" }), 1000);
          }
        }),
      reloadEntity,
      showConfirmationDialog: () => (confirmationDialog.value = true),
      showFieldCreationDialog: () => (fieldCreationDialog.value = true),
    };
  },
  data: () => ({
    scrollOffset: 0,
    overviewContainerHeight: null,
  }),
  methods: {
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
  word-break: break-all;
  font-family: Montserrat;
  font-size: 1.5rem !important;
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
  max-width: 100vw;
  z-index: 2;
  position: absolute;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
  }
}

@media screen and (max-width: 959px) {
  .entity-details-overview-container {
    display: block;
  }
}
</style>
