<template>
  <component :is="wrapperComponent" :id="entity.id" target="_self">
    <div
      class="entity-mini-card-container pa-3 full-width fill-height"
      :class="{ interactive: visible }"
    >
      <entity-avatar
        :entity-id="entity.id"
        :image-id="entity.entityIcon"
        :entity-title="entityTitle"
      />
      <div>
        <div class="d-flex justify-space-between align-center">
          <custom-header
            class=""
            :text="entityTitle"
            v-if="entityTitle"
            style="font-size: 1.05rem !important"
          />
          <span
            class="entity-mini-card-title-placeholder d-block pa-2 mt-2 full-width"
            v-else-if="!visible"
          ></span>
          <entity-like-button small :id="entity.id" class="pl-3" />
        </div>
        <div v-if="visible">
          <v-chip
            class="mr-2"
            x-small
            label
            color="#EFF3F7FF"
            v-for="tag in entityTags"
            :key="tag"
          >
            {{ tag }}
          </v-chip>
        </div>
        <div v-else>
          <v-alert color="warning" text dense class="mb-0 mt-2">
            According to the system policies you have no rights to view this
            entity
          </v-alert>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import CustomHeader from "@/components/Base/CustomHeader";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import EntityLikeButton from "@/components/Entity/EntityLikeButton";
export default {
  name: "EntityMiniCard",
  props: {
    entity: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    EntityLikeButton,
    EntityDetailsLink,
    CustomHeader,
    EntityAvatar,
  },
  computed: {
    wrapperComponent() {
      return this.visible ? "EntityDetailsLink" : "div";
    },
    entityTitle() {
      return this.entity.title || this.entity.username;
    },
    entityTags() {
      return [
        this.entity.entityType,
        this.entity.resourceType,
        this.entity.assetType,
        this.entity.mimeType,
      ]
        .filter((t) => t)
        .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t));
    },
  },
};
</script>

<style scoped lang="scss">
.entity-mini-card-container {
  transition: 0.3s;
  border: 2px solid $bg_card_secondary;
  display: grid;
  grid-template-columns: 32px 1fr;
  grid-gap: 16px;
  @include border-radius;
  &.interactive {
    cursor: pointer;
    &:hover {
      background-color: $bg_card_secondary;
    }
  }
}
.entity-mini-card-title-placeholder {
  @include border-radius-half;
  background-color: $bg_card_secondary;
}
</style>
