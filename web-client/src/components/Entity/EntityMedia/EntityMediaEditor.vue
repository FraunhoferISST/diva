<template>
  <v-dialog
    scrollable
    class="media-editor-dialog"
    v-model="computedOpen"
    max-width="1100"
  >
    <card>
      <div class="media-editor-banner d-flex justify-center">
        <v-img
          class="media-editor-banner-image"
          max-height="100%"
          max-width="100%"
          v-if="entity.entityBanner"
          :src="bannerImageUrl"
        ></v-img>
        <v-icon x-large color="white" v-else> image </v-icon>
        <div class="media-editor-avatar">
          <entity-avatar
            class="elevation-1"
            size="150"
            :entity-id="entity.id"
            :entity-title="entity.title || entity.username"
            :image-id="entity.entityIcon"
          />
        </div>
      </div>
      <v-container fluid class="mb-4">
        <v-tabs
          height="50px"
          centered
          background-color="transparent"
          v-model="tab"
        >
          <v-tabs-slider color="primary"></v-tabs-slider>

          <v-tab v-for="tab in tabs" :key="tab.title">
            {{ tab.title }}
          </v-tab>
        </v-tabs>
      </v-container>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <entity-images-upload
                  :entity-id="entity.id"
                  @uploaded="onImageUpload"
                />
              </v-col>
            </v-row>
            <entity-images-viewer
              class="mt-5"
              :entity="entity"
              @entityIconChanged="onEntityIconChange"
              @entityBannerChanged="onEntityBannerChange"
              @imageDeleted="onImageDeleted"
            />
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container fluid class="pa-0">
            <entity-videos-viewer :entity="entity" />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </card>
  </v-dialog>
</template>

<script>
import Card from "@/components/Base/Card";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import EntityImagesUpload from "@/components/Entity/EntityMedia/EntityImagesUpload";
import EntityImagesViewer from "@/components/Entity/EntityMedia/EntityImagesViewer";
import EntityVideosViewer from "@/components/Entity/EntityMedia/EntityVideosViewer";
import { useApi } from "@/composables/api";
import { useBus } from "@/composables/bus";
import { computed } from "@vue/composition-api";

export default {
  name: "EntityMediaEditor",
  components: {
    EntityVideosViewer,
    EntityImagesViewer,
    EntityImagesUpload,
    EntityAvatar,
    Card,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    entity: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { emit } = useBus();
    const { buildImageUrl, entityCollection } = useApi(props.entity.id);
    return {
      onImageUpload: (imageId) => emit("imageUploaded", imageId),
      onEntityIconChange: (imageId) => emit("entityIconChanged", imageId),
      onEntityBannerChange: (imageId) => emit("entityBannerChanged", imageId),
      onImageDeleted: (imageId) => emit("imageDeleted", imageId),
      bannerImageUrl: computed(() =>
        buildImageUrl(
          entityCollection,
          props.entity.id,
          props.entity.entityBanner
        )
      ),
    };
  },
  data: () => ({
    tab: "1",
    tabs: [
      {
        title: "Images",
      },
      {
        title: "Videos",
      },
    ],
  }),
  computed: {
    computedOpen: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit("update:open", val);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.media-editor-banner {
  position: relative;
  height: 200px;
  border-radius: $border_radius;
  //border-top-right-radius: $border_radius;
  background-color: $bg_card_secondary;
}
.media-editor-banner-image {
  border-radius: $border_radius;
}
.media-editor-avatar {
  position: absolute;
  bottom: -75px;
  left: 50px;
}
</style>
