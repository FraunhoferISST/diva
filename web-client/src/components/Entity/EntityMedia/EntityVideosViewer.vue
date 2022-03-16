<template>
  <v-row no-gutters>
    <template v-if="hasVideos">
      <v-col
        v-for="video in entityVideos"
        :key="video"
        class="d-flex child-flex"
        cols="12"
        sm="3"
      >
        <v-hover>
          <template>
            <div class="relative">
              TODO
              <!--              <v-fade-transition>
                <v-overlay :value="hover" absolute color="black">
                  <div class="text-center">
                    <v-btn text rounded @click="() => useAsIcon(video.id)"
                      >Use as icon</v-btn
                    >
                    <v-btn text rounded @click="() => useAsBanner(video.id)"
                      >Use as banner</v-btn
                    >
                    <v-divider class="my-2"></v-divider>
                    <v-btn text icon>
                      <v-icon> photo_size_select_small </v-icon>
                    </v-btn>
                    <v-btn
                      text
                      icon
                      color="red"
                      class="ml-4"
                      @click="() => showDeletionDialog(video.id)"
                    >
                      <v-icon> delete </v-icon>
                    </v-btn>
                  </div>
                </v-overlay>
              </v-fade-transition>-->
            </div>
          </template>
        </v-hover>
      </v-col>
    </template>
    <v-col cols="12">
      <no-data-state text="Add a few videos" />
    </v-col>
    <v-snackbar
      v-if="hasVideos"
      rounded
      text
      v-model="snackbar"
      :timeout="6000"
      absolute
      :color="snackbarColor"
    >
      <span>
        <b>{{ snackbarMsg }}</b>
      </span>
    </v-snackbar>
    <confirmation-dialog v-if="hasVideos" :show.sync="confirmationDialog">
      You are sure you want to delete the image?
      <template #confirm="{ confirm }">
        <div class="d-flex justify-end">
          <v-btn
            text
            rounded
            color="error"
            :loading="isLoading"
            @click="() => deleteImage().then(confirm)"
          >
            Delete image
          </v-btn>
        </div>
      </template>
    </confirmation-dialog>
  </v-row>
</template>

<script>
import ConfirmationDialog from "@/components/Base/ConfirmationDialog";
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "EntityVideosViewer",
  components: { NoDataState, ConfirmationDialog },
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    confirmationDialog: false,
    snackbar: false,
    snackbarMsg: "",
    snackbarColor: "",
    isLoading: false,
    videoIdToDelete: null,
  }),
  computed: {
    hasVideos() {
      return this.entityVideos.length > 0;
    },
    entityType() {
      return `${this.entity.entityType}s`;
    },
    entityVideos() {
      return this.entity.entityVideos ?? [];
    },
  },
  methods: {
    showSnackbar(msg, color = "success") {
      this.snackbarMsg = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    handlePromise(promise) {
      this.isLoading = true;
      return promise
        .then(() => this.showSnackbar("Successfully updated!"))
        .catch((e) => this.showSnackbar(e, "error"))
        .finally(() => (this.isLoading = false));
    },
    showDeletionDialog(videoUrl) {
      this.videoIdToDelete = videoUrl;
      this.confirmationDialog = true;
    },
    deleteVideo() {
      return this.handlePromise(
        this.$api[this.entityType].deleteImage(
          this.entity.id,
          this.imageIdToDelete
        )
      );
    },
  },
};
</script>

<style scoped></style>
