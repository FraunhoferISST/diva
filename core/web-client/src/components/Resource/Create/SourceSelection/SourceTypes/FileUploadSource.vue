<template>
  <div class="file-upload-container">
    <form
      class="file-upload-form d-flex py-4"
      ref="fileform"
      :class="{ dragover: dragOver }"
    >
      <div class="file-upload-files-container">
        <div class="text-center mb-2">
          <v-icon
            class="d-block mb-5"
            :style="`opacity: ${selectedFile ? '0' : '1'}`"
            large
          >
            attach_file
          </v-icon>
          <clearable-tags
            v-if="selectedFile"
            :item="selectedFile.name"
            @remove="clearFiles"
          />
        </div>
        <input
          type="file"
          @change="processFiles($event.target.files[0])"
          id="input-file"
        />
        <label
          class="v-btn v-size--small v-btn--flat v-btn--depressed v-btn--outlined v-btn--rounded"
          for="input-file"
        >
          <strong class="primary--text">Choose a file</strong>
        </label>
        <span v-if="isDragAndDropCapable" class=""> or drag it here!</span>
      </div>
    </form>
  </div>
</template>

<script>
import ClearableTags from "@/components/Base/ClearableTags";
const isDragAndDropCapable = () => {
  let div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
};

export default {
  name: "FileUploadSource",
  components: { ClearableTags },
  props: {
    source: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selectedFile: null,
    dragOver: false,
    isDragAndDropCapable: isDragAndDropCapable(),
  }),
  computed: {
    computedSource: {
      get() {
        return this.source;
      },
      set(val) {
        this.$emit("update:source", val);
      },
    },
  },
  methods: {
    create() {
      return this.$api.divaLakeAdapter.import(this.selectedFile);
    },
    removeFile() {
      this.selectedFile = null;
    },
    clearFiles() {
      this.selectedFile = null;
      this.computedSource.isReady = false;
    },
    processFiles(file) {
      this.selectedFile = file;
      this.computedSource.isReady = true;
    },
  },
  mounted() {
    this.computedSource.onCreate = this.create;
    if (this.isDragAndDropCapable) {
      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop",
      ].forEach((evt) => {
        this.$refs.fileform.addEventListener(
          evt,
          (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
      });
      this.$refs.fileform.addEventListener("drop", (e) => {
        this.dragOver = false;
        this.processFiles(e.dataTransfer.files[0]);
      });
      this.$refs.fileform.addEventListener("dragover", () => {
        this.dragOver = true;
      });

      this.$refs.fileform.addEventListener("dragleave", () => {
        this.dragOver = false;
      });
    }
  },
};
</script>

<style scoped lang="scss">
.file-upload-container {
  transition: 0.3s;
  height: 100%;
  width: 100%;
}

.file-upload-form {
  box-sizing: border-box;
  border-radius: 10px;
  flex-flow: row wrap;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  transition: 0.3s;
  outline: 2px dashed rgba(146, 176, 179, 0.2);
  outline-offset: -10px;
  outline-radius: 10px;

  &.dragover {
    background-color: rgba(0, 144, 255, 0.02);
  }
}
.file-upload-files-container {
  span {
    flex: 0 0 100%;
    //@include font-style;
    text-align: center;
    font-weight: bold;
    color: $font_secondary_color;
  }

  label {
    cursor: pointer;
  }

  #input-file {
    display: none;
  }
}
</style>
