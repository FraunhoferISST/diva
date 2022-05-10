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
                    <v-btn
                      text
                      rounded
                      color="red"
                      @click="() => showDeletionDialog(image.id)"
                    >
                      <v-icon left> delete </v-icon>
                      Delete
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
      :color="color"
    >
      <span>
        <b>{{ message }}</b>
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
            :loading="loading"
            @click="() => deleteImage().then(() => !error && confirm())"
          >
            Delete image
          </v-btn>
        </div>
      </template>
      <template #info>
        <v-alert class="pa-2 ma-0 mt-3" text color="error" v-if="error">
          {{ error }}
        </v-alert>
      </template>
    </confirmation-dialog>
  </v-row>
</template>

<script>
import ConfirmationDialog from "@/components/Base/ConfirmationDialog";
import NoDataState from "@/components/Base/NoDataState";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { useSnackbar } from "@/composables/snackbar";
import { computed, ref } from "@vue/composition-api";
export default {
  name: "EntityImagesViewer",
  components: { NoDataState, ConfirmationDialog },
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { show, message, color, snackbar } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { entityCollection, buildImageUrl, entityApi } = useApi(
      props.entity.id
    );

    const confirmationDialog = ref(false);
    const imageIdToDelete = ref(null);

    const showDeletionDialog = (imageId) => {
      imageIdToDelete.value = imageId;
      confirmationDialog.value = true;
    };

    const handlePromiseError = (promise) =>
      promise.then(() => {
        if (error.value) {
          show(error.value, { color: "error" });
        }
      });

    const useAsIcon = (imageId) =>
      handlePromiseError(
        request(
          entityApi
            .patch(props.entity.id, {
              entityIcon: imageId,
            })
            .then(() => emit("entityIconChanged", imageId))
        )
      );

    const useAsBanner = (imageId) =>
      handlePromiseError(
        request(
          entityApi
            .patch(props.entity.id, {
              entityBanner: imageId,
            })
            .then(() => emit("entityBannerChanged", imageId))
        )
      );

    const deleteImage = () =>
      handlePromiseError(
        request(
          entityApi
            .deleteImage(props.entity.id, imageIdToDelete.value)
            .then(() => emit("imageDeleted", imageIdToDelete.value))
        )
      );

    return {
      entityCollection,
      hasImages: computed(() => props.entity.entityImages?.length > 0),
      entityImages: computed(() =>
        (props.entity.entityImages ?? []).map((imageId) => ({
          id: imageId,
          url: buildImageUrl(entityCollection, props.entity.id, imageId),
        }))
      ),
      useAsIcon,
      useAsBanner,
      deleteImage,
      show,
      showDeletionDialog,
      message,
      color,
      snackbar,
      loading,
      error,
      confirmationDialog,
      imageIdToDelete,
    };
  },
};
</script>

<style scoped></style>
