<template>
  <div class="create-importing-overlay-container" :class="{ open: open }">
    <div class="create-importing-overlay-btn">
      <v-btn color="error" text @click="close">
        <v-icon small> close </v-icon>
      </v-btn>
    </div>
    <v-container fluid class="pa-0">
      <v-row dense>
        <v-col cols="12" class="px-12 pt-12">
          <div>
            <v-chip-group
              v-model="selectedFilterIndex"
              column
              mandatory
              multiple
            >
              <v-chip
                small
                color="info"
                active
                filter
                outlined
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
                v-if="warnings > 0"
              >
                Warning {{ warnings }}</v-chip
              >
              <v-chip
                small
                color="error"
                active
                filter
                outlined
                v-if="errors > 0"
              >
                Error {{ errors }}</v-chip
              >
            </v-chip-group>
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" class="px-12">
          <v-row dense style="max-height: 315px; overflow: auto">
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="4"
              v-for="(resource, i) in selectedSource.resources"
              :key="i"
            >
              <div class="importing-resource-card">
                <div class="d-flex justify-space-between align-center py-0">
                  <p class="ellipsis ma-0">
                    <span>{{ resource.title }}</span>
                  </p>
                  <div class="pl-4">
                    <v-icon
                      dense
                      color="green"
                      v-if="resource.imported && !resource.warning"
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
                    <v-btn text rounded small color="primary"> retry </v-btn>
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
      </v-row>
      <v-row class="importing-controls-container">
        <v-col
          cols="12"
          class="d-flex justify-space-between align-center px-12 pb-12"
        >
          <p class="ma-0">
            <span>{{ done }}</span>
            <span>/</span>
            <span>{{ selectedSource.resources.length }}</span>
          </p>
          <v-btn text color="red" rounded> Cancel import </v-btn>
        </v-col>
      </v-row>
      <horizontal-progress :loading="!isImportingDone" :progress="progress" />
    </v-container>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import HorizontalProgress from "../../Base/HorizontalProgress";
export default {
  name: "CreateImportingOverlay",
  components: { HorizontalProgress, EntityDetailsLink },
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
    selectedFilterIndex: 0,
  }),
  watch: {
    open(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.selectedSource.onCreate();
        }, 1000);
      }
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
  },
  methods: {
    close() {
      this.computedOpen = false;
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
  bottom: -20px;
}
</style>
