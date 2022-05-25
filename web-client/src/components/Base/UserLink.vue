<template>
  <div>
    <entity-avatar
      :image-id="imageId"
      :entity-id="user.id"
      :entity-title="user.username"
    />
    <entity-details-link v-if="id" :id="user.id" class="user-link-name">
      {{ user.username }}
    </entity-details-link>
    <info-block-value class="ml-2" v-else> Unknown user </info-block-value>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import EntityAvatar from "@/components/Entity/EntityAvatar";
export default {
  name: "UserLink",
  components: { EntityAvatar, InfoBlockValue, EntityDetailsLink },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageId() {
      return this.user?.entityIcon || "";
    },
    id() {
      return this.user?.id;
    },
  },
};
</script>

<style scoped lang="scss">
.user-link-name {
  text-decoration: none;
  padding: 5px 10px;
}
</style>
