<template>
  <data-viewer :loading="loading" :error="error">
    <div v-if="recentEntities.length > 0">
      <div
        class="my-2 ellipsis"
        v-for="entity in recentEntities"
        :key="entity.id"
      >
        <entity-mini-card :entity="entity" />
      </div>
    </div>
    <no-data-state v-else />
  </data-viewer>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useSearch } from "@/composables/search";
import { computed } from "@vue/composition-api";
import EntityMiniCard from "@/components/Entity/EntityMiniCard";
export default {
  name: "DashboardRecentResources",
  components: { EntityMiniCard, DataViewer, NoDataState },
  setup() {
    const { search, data, loading, error } = useSearch();
    search("resource");
    return {
      loading,
      error,
      recentEntities: computed(() =>
        (data.value?.collection ?? [])
          .map(({ doc }) => doc)
          .filter(({ entityType }) => entityType === "resource")
          .slice(0, 5)
      ),
    };
  },
};
</script>

<style scoped lang="scss"></style>
