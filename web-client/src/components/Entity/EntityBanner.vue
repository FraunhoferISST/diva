<template>
  <div>
    <v-img
      v-if="imgUrl"
      max-height="12em"
      max-width="100%"
      :src="imgUrl"
      alt="Entity Banner"
    ></v-img>
    <!--
    <v-sheet
      v-else
      height="12em"
      width="100%"
      class="entity-avatar-placeholder d-flex justify-center align-center"
    ></v-sheet>-->
  </div>
</template>

<script>
import { useApi } from "@/composables/api";
import { computed } from "@vue/composition-api";
export default {
  name: "EntityAvatar",
  props: {
    entityId: {
      type: String,
      required: true,
    },
    entityTitle: {
      type: String,
      default: "",
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
  setup(props) {
    const { buildImageUrl, entityCollection } = useApi(props.entityId);
    return {
      imgUrl: computed(() =>
        props.imageId
          ? buildImageUrl(entityCollection, props.entityId, props.imageId)
          : ""
      ),
      entityAvatarPlaceholderText: computed(() =>
        props.entityTitle[0]?.toUpperCase()
      ),
    };
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
