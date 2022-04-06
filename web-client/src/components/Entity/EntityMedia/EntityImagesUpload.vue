<template>
  <div class="entity-images-upload">
    <div ref="uploaderContainer" class="uploader-container">
      <input
        ref="uploaderInput"
        type="file"
        class="uploader"
        name="uploader"
        multiple
        data-allow-reorder="true"
        data-max-file-size="3MB"
        data-max-files="15"
      />
    </div>
  </div>
</template>

<script>
import * as FilePond from "filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useApi } from "@/composables/api";

export default {
  name: "EntityImagesUpload",
  props: {
    entityId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { imageUrl, entityApi } = useApi(props.entityId);
    return {
      imageUrl,
      entityApi,
    };
  },
  data: () => ({
    uploader: null,
  }),
  mounted() {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    this.uploader = FilePond.create(this.$refs.uploaderInput, {
      acceptedFileTypes: ["image/png", "image/jpeg"],
      labelIdle:
        'Drag & Drop images or <span class="filepond--label-action"> Browse </span> (max 15)',
      imagePreviewHeight: 150,
      multiple: true,
      name: "image",
      allowRevert: false,
      labelFileProcessingError: (error) => {
        return (
          error?.response?.data?.message ?? error.message ?? "Error occurred"
        );
      },
      server: {
        url: this.imageUrl,
        process: (fieldName, file, metadata, load, error) => {
          this.entityApi
            .uploadImage(this.entityId, file)
            .then(({ data }) => load(data))
            .catch((e) => error(e));
          return {};
        },
        revert: (imageId, load, error) => {
          this.entityApi
            .deleteImage(this.entityId, "test")
            .then(({ data }) => load(data))
            .catch((e) => error(e));
        },
        restore: null,
        load: null,
        fetch: null,
      },
      instantUpload: true,
    });
  },
  beforeDestroy() {
    this.uploader.removeFiles();
  },
};
</script>

<style lang="scss">
.uploader-container {
  outline: 2px dashed $btn_flat_text;
  border-radius: $border_radius;
}
.filepond--item {
  width: calc(25% - 0.5em);
}
.filepond--panel-root {
  background-color: white;
  border-radius: $border_radius;
}
.filepond--item-panel {
  background-color: $bg_card;
}

.filepond--image-preview {
  background-color: $bg_card_secondary;
}
</style>
