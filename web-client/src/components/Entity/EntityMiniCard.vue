<template>
  <entity-details-link :id="entity.id" target="_self">
    <div class="entity-mini-card-container pa-3 full-width fill-height">
      <entity-avatar
        :entity-id="entity.id"
        :image-id="entity.entityIcon"
        :entity-title="entityTitle"
      />
      <div>
        <div>
          <custom-header class="" :text="entityTitle" />
        </div>
        <div>
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
      </div>
    </div>
  </entity-details-link>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import CustomHeader from "@/components/Base/CustomHeader";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
export default {
  name: "EntityMiniCard",
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  components: { EntityDetailsLink, CustomHeader, EntityAvatar },
  computed: {
    entityTitle() {
      return this.entity.title || this.entity.username || "Entity";
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
  cursor: pointer;
  &:hover {
    background-color: $bg_card_secondary;
  }
}
</style>
