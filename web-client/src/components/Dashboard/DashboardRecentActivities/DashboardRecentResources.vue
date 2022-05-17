<template>
  <data-viewer :loading="loading" :error="error">
    <div v-if="recentEntities.length > 0">
      <v-container fluid class="pa-0">
        <v-row dense>
          <v-col cols="12" v-for="entity in recentEntities" :key="entity.id">
            <entity-mini-card :entity="entity" />
          </v-col>
        </v-row>
      </v-container>
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
    search("resource", {
      pageSize: 5,
      entityType: "resource",
      sortBy: "createdAt",
    });
    return {
      loading,
      error,
      recentEntities: computed(() =>
        (data.value?.collection ?? []).map(({ doc }) => doc)
      ),
    };
  },
};
</script>

<style scoped lang="scss"></style>
