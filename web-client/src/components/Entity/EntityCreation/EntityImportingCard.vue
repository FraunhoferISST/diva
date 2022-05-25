<template>
  <div
    class="entity-importing-card"
    :class="{ warning: entity.warning, error: entity.error }"
  >
    <div class="d-flex justify-space-between align-center py-0">
      <p class="ellipsis ma-0">
        <entity-details-link target="_blank" v-if="entity.id" :id="entity.id">
          {{ entity.title }}
        </entity-details-link>
        <span v-else>
          {{ entity.title }}
        </span>
      </p>
      <div class="pl-4">
        <span class="entity-importing-card-status" v-if="entity.loading">
          Importing...
        </span>
        <v-icon
          dense
          color="green"
          v-else-if="entity.imported && !entity.warning"
        >
          done
        </v-icon>
        <v-tooltip top v-else>
          <template #activator="{ on, attrs }">
            <v-icon
              dense
              :color="entity.warning ? 'warning' : 'error'"
              v-bind="attrs"
              v-on="on"
            >
              info
            </v-icon>
          </template>
          <span>{{ entity.warning || entity.error }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
export default {
  name: "EntityImportingCard",
  components: { EntityDetailsLink },
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.entity-importing-card {
  padding: 10px;
  border-radius: $border_radius;
  background: $bg_card_secondary;
  &.error {
    background-color: #fff1f1 !important;
  }
  &.warning {
    background-color: #fff6eb !important;
  }
}
.entity-importing-card-status {
  font-size: 0.8rem;
}
</style>
