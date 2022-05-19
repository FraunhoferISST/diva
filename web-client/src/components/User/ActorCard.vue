<template>
  <div class="actor-card" :class="{ dense: dense }">
    <div>
      <entity-avatar
        :size="dense ? 32 : 40"
        :entity-id="actorId"
        :entity-title="actorName"
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
            <entity-details-link v-if="actorId" :id="actorId">
              {{ actorName }}
            </entity-details-link>
            <span v-else>
              {{ actorName }}
            </span>
          </h4>
          <slot> </slot>
        </div>
        <div v-if="actor.email && !dense">
          <span> {{ actor.email }}</span>
        </div>
        <slot name="info"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import { useUser } from "@/composables/user";

export default {
  name: "ActorCard",
  components: { EntityDetailsLink, EntityAvatar },
  props: {
    actor: {
      type: Object,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const { user } = useUser();
    return {
      user,
    };
  },
  computed: {
    actorId() {
      return this.actor.id ?? "";
    },
    actorName() {
      if (this.user.id === this.actorId) {
        return "You";
      }
      return !this.visible
        ? "Actor with Restricted access"
        : this.actor.username ??
            this.actor.serviceName ??
            this.actor.title ??
            "N/A";
    },
    imageId() {
      return this.actor.entityIcon ?? "";
    },
  },
};
</script>

<style scoped lang="scss">
.actor-card {
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-gap: 10px;
  &.dense {
    grid-template-columns: 32px 1fr;
  }
}
</style>
