<template>
  <v-container class="pa-0 fill-height" fluid>
    <create-importing-overlay
      v-if="selectedSource"
      :selected-source="selectedSource"
      :open.sync="showImportingOverlay"
    />
    <v-row no-gutters>
      <fade-in>
        <div
          class="create-form-return-btn"
          v-if="window === 1 && !showImportingOverlay"
        >
          <v-btn color="primary" text @click="goBack">
            <v-icon> chevron_left </v-icon>
          </v-btn>
        </div>
      </fade-in>
      <v-col cols="12" v-if="isSmAndDown">
        <create-button-section
          :is-ready="isReady"
          :is-loading="isLoading"
          @create="initializeImport"
        />
      </v-col>
      <v-col cols="12" md="8" class="pa-8 relative">
        <v-window v-model="window" class="fill-height">
          <v-window-item>
            <v-col cols="12">
              <v-text-field
                rounded
                v-model="search"
                label="Filter sources"
                outlined
                hide-details
                light
                dense
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col
                  v-for="source in filteredSources"
                  :key="source.title"
                  cols="12"
                  sm="4"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <source-type-card
                    :source="source"
                    @selected="onSourceSelect"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-window-item>
          <v-window-item class="fill-height">
            <v-col cols="12" class="fill-height">
              <fade-in>
                <component
                  v-if="selectedSource"
                  :source.sync:="selectedSource"
                  :is="selectedSource.component"
                />
              </fade-in>
            </v-col>
          </v-window-item>
        </v-window>
        <v-snackbar
          rounded
          text
          v-model="snackbar"
          :timeout="10000"
          absolute
          color="error"
        >
          <p class="mb-2">
            <b>Something went wrong! Please check the data and try again</b>
          </p>
          <v-divider class="mb-2"></v-divider>
          <span>
            <b>{{ snackbarMsg }}</b>
          </span>
        </v-snackbar>
      </v-col>
      <v-col cols="12" md="4" v-if="!isSmAndDown">
        <create-button-section
          :is-ready="isReady"
          :is-loading="isLoading"
          @create="initializeImport"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CreateButtonSection from "@/components/Resource/Create/CreateButtonSection";
import SourceTypeCard from "@/components/Resource/Create/SourceSelection/SourceTypeCard";
import FileUploadSource from "@/components/Resource/Create/SourceSelection/SourceTypes/FileUploadSource";
import GenericSource from "@/components/Resource/Create/SourceSelection/SourceTypes/GenericSource";
import UrbanPulseSource from "@/components/Resource/Create/SourceSelection/SourceTypes/UrbanPulseSource";
import FadeIn from "@/components/Transitions/FadeIn";
import ColoredCard from "@/components/Base/ColoredCard";
import CreateResultOverlay from "@/components/Resource/Create/CreateResultOverlay";
import CreateImportingOverlay from "./CreateImportingOverlay";
export default {
  name: "CreationResourceForm",
  components: {
    CreateImportingOverlay,
    CreateResultOverlay,
    ColoredCard,
    FadeIn,
    SourceTypeCard,
    CreateButtonSection,
    FileUploadSource,
    UrbanPulseSource,
    GenericSource,
  },
  data: () => ({
    search: "",
    window: 0,
    selectedSource: null,
    snackbar: false,
    snackbarMsg: "",
    sources: [
      {
        title: "Generic resource",
        component: GenericSource,
        resources: [],
        icon: "file.svg",
        isReady: false,
        onCreate: () => {},
      },
      {
        title: "Upload files from your disc",
        component: FileUploadSource,
        resources: [],
        icon: "upload.svg",
        isReady: false,
        onCreate: () => {},
      },
      {
        title: "UrbanPulse",
        resources: [],
        component: UrbanPulseSource,
        icon: "dksr.jpg",
        isReady: false,
        onCreate: () => {},
      },
    ],
    isLoading: false,
    response: {},
    showImportingOverlay: false,
  }),
  computed: {
    isReady() {
      return !!(this.selectedSource && this.selectedSource.isReady);
    },
    isSmAndDown() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    filteredSources() {
      return this.search
        ? this.sources.filter((s) =>
            s.title.toLowerCase().includes(this.search.toLowerCase())
          )
        : this.sources;
    },
  },
  methods: {
    goBack() {
      this.selectedSource = null;
      this.window = 0;
    },
    onSourceSelect(source) {
      this.selectedSource = source;
      this.window = 1;
    },
    initializeImport() {
      this.showImportingOverlay = true;
    },
    handleCreationResult(response) {
      this.response = response;
      this.showImportingOverlay = true;
      this.selectedSource = null;
      this.window = 0;
    },
    showSnackbar(msg) {
      this.snackbarMsg = msg;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped lang="scss">
.create-form-return-btn {
  position: absolute;
  z-index: 11;
}
</style>
