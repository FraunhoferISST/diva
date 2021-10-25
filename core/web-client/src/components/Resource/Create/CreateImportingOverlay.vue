<template>
  <div class="create-importing-overlay-container" :class="{ open: open }">
    <div class="create-importing-overlay-btn" v-if="isImportingDone">
      <v-btn color="error" text @click="close">
        <v-icon small> close </v-icon>
      </v-btn>
    </div>
    <v-container fluid class="pa-0">
      <v-row dense>
        <v-col cols="12" class="px-12 pt-12">
          <div>
            <v-chip-group v-model="selectedFilters" column mandatory multiple>
              <v-chip
                small
                color="info"
                active
                filter
                outlined
                value="loading"
                v-if="importing > 0"
              >
                In progress {{ importing }}
              </v-chip>
              <v-chip
                small
                color="success"
                active
                filter
                outlined
                value="success"
                v-if="success > 0"
              >
                Success {{ success }}
              </v-chip>
              <v-chip
                small
                color="warning"
                active
                filter
                outlined
                value="warning"
                v-if="warnings > 0"
              >
                Warning {{ warnings }}
              </v-chip>
              <v-chip
                small
                color="error"
                active
                filter
                outlined
                value="error"
                v-if="errors > 0"
              >
                Error {{ errors }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-2" dense>
        <v-col cols="12" class="px-12">
          <v-row
            ref="resourcesContainer"
            dense
            style="max-height: 485px; overflow: auto"
          >
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col
                  cols="12"
                  v-for="(resource, i) in resourcesListsColumns[0]"
                  :key="i"
                >
                  <div class="importing-resource-card">
                    <div class="d-flex justify-space-between align-center py-0">
                      <p class="ellipsis ma-0">
                        <entity-details-link
                          target="_blank"
                          v-if="resource.id"
                          :id="resource.id"
                        >
                          {{ resource.title }}
                        </entity-details-link>
                        <span v-else>
                          {{ resource.title }}
                        </span>
                      </p>
                      <div class="pl-4">
                        <span v-if="resource.loading"> Importing... </span>
                        <v-icon
                          dense
                          color="green"
                          v-else-if="resource.imported && !resource.warning"
                        >
                          done
                        </v-icon>
                      </div>
                    </div>
                    <v-alert
                      dense
                      text
                      color="error"
                      class="ma-0 mt-2"
                      v-if="resource.error"
                    >
                      {{ resource.error }}
                      <div class="d-flex justify-end">
                        <v-btn text rounded small color="primary">
                          retry
                        </v-btn>
                      </div>
                    </v-alert>
                    <v-alert
                      dense
                      text
                      color="warning"
                      class="ma-0 mt-2"
                      v-if="resource.warning"
                    >
                      {{ resource.warning }}
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col
                  cols="12"
                  v-for="(resource, i) in resourcesListsColumns[1]"
                  :key="i"
                >
                  <div class="importing-resource-card">
                    <div class="d-flex justify-space-between align-center py-0">
                      <p class="ma-0">
                        <entity-details-link
                          target="_blank"
                          v-if="resource.id"
                          :id="resource.id"
                        >
                          {{ resource.title }}
                        </entity-details-link>
                        <span v-else>
                          {{ resource.title }}
                        </span>
                      </p>
                      <div class="pl-4">
                        <span v-if="resource.loading"> Importing... </span>
                        <v-icon
                          dense
                          color="green"
                          v-else-if="resource.imported && !resource.warning"
                        >
                          done
                        </v-icon>
                      </div>
                    </div>
                    <v-alert
                      dense
                      text
                      color="error"
                      class="ma-0 mt-2"
                      v-if="resource.error"
                    >
                      {{ resource.error }}
                      <div class="d-flex justify-end">
                        <v-btn text rounded small color="primary">
                          retry
                        </v-btn>
                      </div>
                    </v-alert>
                    <v-alert
                      dense
                      text
                      color="warning"
                      class="ma-0 mt-2"
                      v-if="resource.warning"
                    >
                      {{ resource.warning }}
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pa-0 py-4">
              <observer @intersect="loadFilteredResourcesPage" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="importing-controls-container">
        <div class="d-flex justify-space-between align-center px-10 pb-4">
          <p class="ma-0">
            <span>{{ done }}</span>
            <span>/</span>
            <span>{{ selectedSource.resources.length }}</span>
          </p>
          <v-btn text color="red" rounded> Cancel import </v-btn>
        </div>
      </div>
      <horizontal-progress :loading="!isImportingDone" :progress="progress" />
      <v-snackbar
        rounded
        text
        v-model="snackbar"
        :timeout="10000"
        absolute
        :color="snackbarColor"
      >
        <b>{{ snackbarText }}</b>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import HorizontalProgress from "@/components/Base/HorizontalProgress";
import InfiniteScroll from "@/components/Mixins/infiniteScroll";
import Observer from "@/components/Base/Observer";
export default {
  name: "CreateImportingOverlay",
  mixins: [InfiniteScroll],
  components: { HorizontalProgress, EntityDetailsLink, Observer },
  props: {
    selectedSource: {
      type: Object,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    selectedFilters: ["loading", "success", "warning", "error"],
    filtersMap: {
      loading: (resource) => resource.loading,
      success: (resource) => resource.imported && !resource.warning,
      warning: (resource) => resource.warning,
      error: (resource) => resource.error,
    },
    snackbar: false,
    snackbarText: "false",
    snackbarColor: "success",
    page: 0,
    pageSize: 30,
    loadedResources: [],
  }),
  watch: {
    open(newVal) {
      if (newVal) {
        this.loadedResources = this.selectedSource.resources.slice(
          0,
          this.pageSize
        );
        setTimeout(() => {
          this.selectedSource.onCreate().then(() => {
            if (this.success === this.selectedSource.resources.length) {
              this.showSnackbar("All data successfully imported!");
            } else if (this.errors > 0) {
              this.showSnackbar(
                "The import has been completed with errors",
                "error"
              );
            } else {
              this.showSnackbar(
                "The import has been completed with warnings",
                "warning"
              );
            }
          });
        }, 500);
      }
    },
    selectedFilters() {
      this.resetPagination();
    },
  },
  computed: {
    computedOpen: {
      get() {
        return this.open;
      },
      set(value) {
        this.$emit("update:open", value);
      },
    },
    filteredResources() {
      return this.selectedSource.resources.filter((resource) =>
        this.selectedFilters.some((filterIndex) =>
          this.filtersMap[filterIndex](resource)
        )
      );
    },
    resourcesListsColumns() {
      const middle = Math.ceil(this.loadedResources.length / 2);
      return [
        this.loadedResources.slice(0, middle),
        this.loadedResources.slice(middle),
      ];
    },
    progress() {
      return (this.done * 100) / this.selectedSource.resources.length;
    },
    isImportingDone() {
      return this.selectedSource.resources.every(({ loading }) => !loading);
    },
    errors() {
      return this.selectedSource.resources.filter(({ error }) => error).length;
    },
    warnings() {
      return this.selectedSource.resources.filter(({ warning }) => warning)
        .length;
    },
    success() {
      return this.selectedSource.resources.filter(
        ({ imported, warning }) => imported && !warning
      ).length;
    },
    done() {
      return this.warnings + this.success + this.errors;
    },
    importing() {
      return (
        this.selectedSource.resources.length -
        this.done -
        this.errors -
        this.warnings
      );
    },
    pages() {
      return Math.ceil(this.filteredResources.length / this.pageSize);
    },
  },
  methods: {
    reset() {
      this.selectedFilters = ["loading", "success", "warning", "error"];
      this.resetPagination();
    },
    resetPagination() {
      this.page = 0;
      this.loadedResources = this.filteredResources.slice(0, this.pageSize);
      this.$refs.resourcesContainer.scrollTop = 0;
    },
    close() {
      this.computedOpen = false;
      this.reset();
    },
    showSnackbar(text, color = "success") {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    loadFilteredResourcesPage(observerState) {
      if (this.page < this.pages) {
        this.loadPageSync(observerState, () => {
          this.page += 1;
          this.loadedResources = this.filteredResources.slice(
            0,
            this.page * this.pageSize + this.pageSize
          );
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.create-importing-overlay-container {
  transition: 0.3s;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
  &.open {
    top: 0;
  }
}
.create-importing-overlay-btn {
  position: absolute;
  right: 0;
  top: 0;
}
.importing-resource-card {
  padding: 10px;
  border-radius: $border_radius;
  background: $bg_card_secondary;
}
.importing-controls-container {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
}
</style>
