<template>
  <div class="file-upload-container pa-1">
    <div
      class="d-flex justify-space-between align-center pb-2"
      v-if="selectedFiles.length > 0"
    >
      <p class="ma-0">
        <span> Files: {{ selectedFilesStats.count }} </span>
        <span class="ml-2">Size: {{ selectedFilesStats.size }}</span>
      </p>
      <v-btn rounded text small color="error" @click="clearFiles">
        clear all
      </v-btn>
    </div>
    <div
      class="file-upload-form d-flex align-center"
      ref="fileform"
      :class="{ dragover: dragOver }"
    >
      <div class="file-upload-files-container text-center full-width">
        <div class="mb-2">
          <v-icon v-if="selectedFiles.length === 0" class="d-block mb-5" large>
            attach_file
          </v-icon>
          <div v-if="selectedFiles.length > 0">
            <div class="selected-files-container">
              <clearable-tags
                v-for="(file, i) in selectedFiles"
                :item="file.name"
                :key="i"
                @remove="() => removeFile(i)"
              />
            </div>
          </div>
        </div>
        <input
          type="file"
          @change="selectFiles"
          multiple
          id="input-files-select"
        />
        <label
          class="v-btn v-size--small v-btn--flat v-btn--depressed v-btn--outlined v-btn--rounded"
          for="input-files-select"
        >
          <strong class="primary--text">Choose files</strong>
        </label>
        <span class="mx-2">or</span>
        <input
          type="file"
          directory
          webkitdirectory
          @change="selectFiles"
          id="input-folder-select"
        />
        <label
          class="v-btn v-size--small v-btn--flat v-btn--depressed v-btn--outlined v-btn--rounded"
          for="input-folder-select"
        >
          <strong class="primary--text">select a folder</strong>
        </label>
        <p v-if="isDragAndDropCapable" class="mt-4 mb-0">or drag it here!</p>
      </div>
    </div>
  </div>
</template>

<script>
import ClearableTags from "@/components/Base/ClearableTags";
import formatByteSize from "@/utils/byteSizeFormatter";

const isDragAndDropCapable = () => {
  let div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
};

const entryToFile = async (entry) =>
  new Promise((resolve) => entry.file(resolve));
const readEntry = async (reader) =>
  new Promise((resolve) => reader.readEntries(resolve));

const getFilesFromEntry = async (entry) => {
  const files = [];
  if (entry.isFile) {
    files.push(await entryToFile(entry));
  } else {
    const entries = await readEntry(entry.createReader());
    for (const ent of entries) {
      files.push(...(await getFilesFromEntry(ent)));
    }
  }
  return files;
};

const extractFilesFromDataTransferItems = async (items) => {
  const promises = [];
  const files = [];
  items.forEach((item) => {
    promises.push(getFilesFromEntry(item.webkitGetAsEntry()));
  });
  const data = await Promise.all(promises);
  for (const extractedFiles of data) {
    files.push(...extractedFiles);
  }
  return files;
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
    selectedFiles: [],
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
    selectedFilesStats() {
      return {
        count: this.selectedFiles.length,
        size: formatByteSize(
          this.selectedFiles
            .map(({ size }) => size)
            .reduce((size, acc) => size + acc)
        ),
      };
    },
  },
  methods: {
    create() {
      return Promise.all(
        this.computedSource.resources.map((resource) => {
          resource.loading = true;
          resource.imported = false;
          resource.warning = "";
          resource.error = "";
          return this.$api.divaLakeAdapter
            .import(resource.file)
            .then(({ data }) => {
              resource.id = data;
              resource.imported = true;
            })
            .catch((e) => {
              if (e?.response?.data?.code === 409) {
                resource.warning = "This file has already been uploaded";
                resource.imported = true;
              } else {
                resource.error =
                  e?.response?.data?.message ??
                  e?.message ??
                  "Some error occurred";
              }
            })
            .finally(() => {
              resource.loading = false;
            });
        })
      );
    },
    removeFile(i) {
      this.selectedFiles.splice(i, 1);
      if (this.selectedFiles.length === 0) {
        this.computedSource.isReady = false;
      }
    },
    clearFiles() {
      this.selectedFiles = [];
      this.computedSource.isReady = false;
    },
    async selectFiles(event) {
      let files = [];
      if (event.dataTransfer) {
        files = await extractFilesFromDataTransferItems(
          event.dataTransfer?.items ?? []
        );
      } else {
        files = event?.target?.files ?? [];
      }
      this.selectedFiles.unshift(...files);
      this.computedSource.isReady = this.selectedFiles.length > 0;
      this.computedSource.resources = this.selectedFiles.map((file) => ({
        title: file.name,
        error: "",
        warning: "",
        imported: false,
        loading: true,
        file,
      }));
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
        this.selectFiles(e);
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
  display: flex;
  flex-flow: column wrap;
}

.file-upload-form {
  box-sizing: border-box;
  border-radius: 10px;
  flex-flow: row wrap;
  flex-grow: 1;
  width: 100%;
  justify-content: center;
  transition: 0.3s;
  outline: 2px dashed rgba(146, 176, 179, 0.2);

  &.dragover {
    outline: 2px dashed $btn_flat_text;
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

  #input-files-select,
  #input-folder-select {
    display: none;
  }
}

.selected-files-container {
  max-height: 390px;
  overflow: auto;
}
</style>
