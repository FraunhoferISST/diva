<template>
  <div>
    <user-avatar :image-id="imageId" :user-id="user.id" />
    <entity-details-link v-if="id" :id="user.id" class="user-link-name">
      {{ user.username }}
    </entity-details-link>
    <info-block-value class="ml-2" v-else> Unknown user </info-block-value>
  </div>
</template>

<script>
import UserAvatar from "@/components/User/UserAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
export default {
  name: "UserLink",
  components: { InfoBlockValue, EntityDetailsLink, UserAvatar },
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
