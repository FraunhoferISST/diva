<template>
  <v-avatar :size="size">
    <img v-if="imgUrl" :src="imgUrl" alt="Entity Avatar" />
    <span
      v-else
      class="entity-avatar-placeholder d-flex justify-center align-center"
    >
      <span>
        {{ entityAvatarPlaceholderText }}
      </span>
    </span>
  </v-avatar>
</template>

<script>
import api from "@/api/index";
export default {
  name: "EntityAvatar",
  props: {
    entityId: {
      type: String,
      required: true,
    },
    entityTitle: {
      type: String,
      default: "Entity",
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
    entityAvatarPlaceholderText() {
      return this.entityTitle[0].toLocaleUpperCase();
    },
    imgUrl() {
      const entityType = this.entityId.slice(0, this.entityId.indexOf(":"));
      if (this.imageId) {
        return `${api.endpoint}/${entityType}s/${this.entityId}/images/${this.imageId}`;
      }
      return "";
    },
  },
};
</script>

<style scoped lang="scss">
.entity-avatar-placeholder {
  height: 100%;
  width: 100%;
  display: block;
  background-color: $bg_card_secondary;
}
</style>
