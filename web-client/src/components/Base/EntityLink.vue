<template>
  <div>
    <entity-avatar
      :image-id="imageId"
      :entity-id="entity.id"
      :entity-title="entity.title || entity.username"
    />
    <entity-details-link v-if="id" :id="entity.id" class="entity-link-name">
      {{ entity.title || entity.username }}
    </entity-details-link>
    <info-block-value class="ml-2" v-else> Unknown entity </info-block-value>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import EntityAvatar from "@/components/Entity/EntityAvatar";
export default {
  name: "EntityLink",
  components: { EntityAvatar, InfoBlockValue, EntityDetailsLink },
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageId() {
      return this.entity?.entityIcon || "";
    },
    id() {
      return this.entity?.id;
    },
  },
};
</script>

<style scoped lang="scss">
.entity-link-name {
  text-decoration: none;
  padding: 5px 10px;
}
</style>
