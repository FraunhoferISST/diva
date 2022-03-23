<template>
  <div class="user-card" :class="{ dense: dense }">
    <div>
      <entity-avatar
        :size="dense ? 32 : 40"
        :entity-id="userId"
        :entity-title="username"
        :image-id="imageId"
      />
    </div>
    <div class="d-flex align-center">
      <div class="full-width">
        <div
          class="d-flex align-center"
          :class="{ 'justify-space-between': !dense }"
        >
          <h4 class="ellipsis">
            <entity-details-link v-if="userId" :id="userId">
              {{ username }}
            </entity-details-link>
            <span v-else>
              {{ username }}
            </span>
          </h4>
          <slot> </slot>
        </div>
        <div v-if="user.email && !dense">
          <span> {{ user.email }}</span>
        </div>
        <slot name="info"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
export default {
  name: "UserCard",
  components: { EntityDetailsLink, EntityAvatar },
  props: {
    user: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userId() {
      return this.user.id ?? "";
    },
    username() {
      return this.user.username ?? "N/A";
    },
    imageId() {
      return this.user.entityIcon ?? "";
    },
  },
};
</script>

<style scoped lang="scss">
.user-card {
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-gap: 10px;
  &.dense {
    grid-template-columns: 32px 1fr;
  }
}
</style>
