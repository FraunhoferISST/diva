<template>
  <v-avatar :size="size">
    <img v-if="imgUrl" :src="imgUrl" alt="User Avatar" />
    <img
      v-else
      style="width: 100%; max-width: 200px; height: auto"
      :src="require('@/assets/avatar-placeholder.svg')"
      alt="User Avatar"
    />
  </v-avatar>
</template>

<script>
import { endpoint } from "@/api/http";
export default {
  name: "UserAvatar",
  props: {
    userId: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: false,
    },
    size: {
      type: [String, Number],
      required: false,
      default: 32,
    },
  },
  computed: {
    imgUrl() {
      if (this.imageId) {
        return `${endpoint}/users/${this.userId}/images/${this.imageId}`;
      }
      return "";
    },
  },
};
</script>

<style scoped></style>
