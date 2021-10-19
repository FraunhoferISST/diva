<template>
  <div class="create-importing-overlay-container" :class="{ open: open }">
    <div class="create-importing-overlay-btn">
      <v-btn color="error" text @click="close">
        <v-icon small> close </v-icon>
      </v-btn>
    </div>
    <v-container fluid class="pa-12">
      <v-row dense>
        <v-col cols="12">
          <div>
            <v-chip-group
              v-model="selectedFilterIndex"
              column
              mandatory
              multiple
            >
              <v-chip small color="info" filter outlined v-if="importing > 0">
                In progress {{ importing }}
              </v-chip>
              <v-chip small color="success" filter outlined v-if="done > 0">
                Done {{ done }}
              </v-chip>
              <v-chip small color="warning" filter outlined v-if="warnings > 0">
                Warning {{ warnings }}</v-chip
              >
              <v-chip small color="error" filter outlined v-if="errors > 0">
                Error {{ errors }}</v-chip
              >
            </v-chip-group>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-row
            dense
            style="
              height: 290px;
              overflow: auto;
              padding-right: -100px !important;
            "
          >
            <v-col
              cols="12"
              sm="12"
              md="6"
              lg="6"
              xl="4"
              v-for="(resource, i) in selectedSource.resources"
              :key="i"
            >
              <div>
                <div class="d-flex justify-space-between align-center py-2">
                  <p class="ellipsis ma-0">
                    <span>{{ resource.title }}</span>
                  </p>
                  <div class="pl-2">
                    <v-btn icon>
                      <v-icon> add </v-icon>
                    </v-btn>
                    <v-icon dense class="pl-4" color="green"> done </v-icon>
                  </div>
                </div>
                <v-alert dense text color="error"> Some error </v-alert>
                <horizontal-progress loading />
                <v-divider />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <p class="ma-0">
            <span>{{ 0 }}</span>
            <span>/</span>
            <span>{{ selectedSource.resources.length }}</span>
          </p>
          <v-btn text color="red" rounded> Cancel import </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import SubHeader from "@/components/Base/SubHeader";
import HorizontalProgress from "../../Base/HorizontalProgress";
export default {
  name: "CreateImportingOverlay",
  components: { HorizontalProgress, SubHeader, EntityDetailsLink },
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
  computed: {
    computedOpen: {
      get() {
        return this.open;
      },
      set(value) {
        this.$emit("update:open", value);
      },
    },
    isImportingDone() {
      return this.selectedSource.resources.every(({ isLoading }) => !isLoading);
    },
    errors() {
      return this.selectedSource.resources.filter(({ error }) => error).length;
    },
    warnings() {
      return this.selectedSource.resources.filter(({ warning }) => warning)
        .length;
    },
    done() {
      return this.selectedSource.resources.filter(({ imported }) => imported)
        .length;
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
</style>
