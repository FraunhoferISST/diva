<template>
  <v-row no-gutters>
    <template v-if="hasImages">
      <v-col
        v-for="image in entityImages"
        :key="image.id"
        class="d-flex child-flex"
        cols="12"
        sm="3"
      >
        <v-hover>
          <template #default="{ hover }">
            <div class="relative">
              <v-img
                max-height="150px"
                :src="image.url"
                aspect-ratio="1"
                class="grey lighten-2"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-fade-transition>
                <v-overlay :value="hover" absolute color="black">
                  <div class="text-center">
                    <v-btn text rounded @click="() => useAsIcon(image.id)"
                      >Use as icon</v-btn
                    >
                    <v-btn text rounded @click="() => useAsBanner(image.id)"
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
                      @click="() => showDeletionDialog(image.id)"
                    >
                      <v-icon> delete </v-icon>
                    </v-btn>
                  </div>
                </v-overlay>
              </v-fade-transition>
            </div>
          </template>
        </v-hover>
      </v-col>
    </template>
    <v-col cols="12" v-else>
      <no-data-state text="Upload a few images to use them as icon or banner" />
    </v-col>
    <v-snackbar
      v-if="hasImages"
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
    <confirmation-dialog v-if="hasImages" :show.sync="confirmationDialog">
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
import imageUrl from "@/utils/imageUrl";
import ConfirmationDialog from "@/components/Base/ConfirmationDialog";
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "EntityImagesViewer",
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
    image: "",
    isLoading: false,
    imageIdToDelete: null,
  }),
  computed: {
    hasImages() {
      return this.entityImages.length > 0;
    },
    entityType() {
      return `${this.entity.entityType}s`;
    },
    entityImages() {
      return (this.entity.entityImages ?? []).map((imageId) => ({
        id: imageId,
        url: imageUrl(this.entity.id, imageId),
      }));
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
    useAsIcon(imageId) {
      return this.handlePromise(
        this.$api[this.entityType].patch(this.entity.id, {
          entityIcon: imageId,
        })
      );
    },
    useAsBanner(imageId) {
      return this.handlePromise(
        this.$api[this.entityType].patch(this.entity.id, {
          entityBanner: imageId,
        })
      );
    },
    showDeletionDialog(imageId) {
      this.imageIdToDelete = imageId;
      this.confirmationDialog = true;
    },
    deleteImage() {
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
