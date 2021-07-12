<template>
  <div class="avatar-editor relative">
    <v-dialog v-model="editorDialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn x-large icon v-on="on">
          <user-avatar v-on="on" :size="60" :image="avatarUrl" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text class="text-center pt-6">
          <vue-avatar
            :width="300"
            :height="300"
            :borderRadius="150"
            :scale="zoom"
            ref="avatar"
          >
          </vue-avatar>
          <v-slider
            v-model="zoom"
            prepend-icon="zoom_in"
            hide-details
            min="1"
            max="10"
          />
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            rounded
            text
            :loading="loading"
            @click="editorDialog = false"
          >
            cancel
          </v-btn>
          <v-btn color="success" rounded text :loading="loading" @click="save">
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-if="avatarUrl"
      text
      icon
      color="red"
      class="remove-img"
      @click="removeAvatar"
    >
      <v-icon> close </v-icon>
    </v-btn>
  </div>
</template>

<script>
import UserAvatar from "@/components/User/UserAvatar";
import { VueAvatar } from "vue-avatar-editor-improved";

export default {
  name: "AvatarEditor",
  components: { UserAvatar, VueAvatar },
  data: () => ({
    editorDialog: false,
    zoom: 1,
    avatarUrl: "",
    loading: false,
  }),
  watch: {
    position(val) {
      this.pos = val;
    },
  },
  computed: {},
  methods: {
    async save() {
      this.loading = true;
      const imgCanvas = this.$refs.avatar.getImageScaled();
      this.avatarUrl = imgCanvas.toDataURL();
      const imgBlob = await this.convertToBlob(imgCanvas);
      this.$emit("imageReady", { imgBlob, imgUrl: this.avatarUrl });
      this.loading = false;
      this.editorDialog = false;
    },
    removeAvatar() {
      this.avatarUrl = "";
    },
    convertToBlob(imgCanvas) {
      return new Promise((resolve) => {
        imgCanvas.toBlob((blob) => resolve(blob), "image/png");
      });
    },
  },
};
</script>

<style scoped lang="scss">
.avatar-editor {
  min-height: 60px;
  &:hover {
    .remove-img {
      opacity: 1;
    }
  }
}
.remove-img {
  opacity: 0;
  transition: 0.3s;
  position: absolute !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 10;
}
</style>
