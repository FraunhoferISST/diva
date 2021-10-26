<template>
  <div class="entity-importing-card">
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
        <span v-if="entity.loading"> Importing... </span>
        <v-icon
          dense
          color="green"
          v-else-if="entity.imported && !entity.warning"
        >
          done
        </v-icon>
      </div>
    </div>
    <v-alert dense text color="error" class="ma-0 mt-2" v-if="entity.error">
      {{ entity.error }}
      <!--      <div class="d-flex justify-end">
        <v-btn text rounded small color="primary"> retry </v-btn>
      </div>-->
    </v-alert>
    <v-alert dense text color="warning" class="ma-0 mt-2" v-if="entity.warning">
      {{ entity.warning }}
    </v-alert>
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
}
</style>
