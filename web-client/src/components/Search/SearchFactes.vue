<template>
  <v-container class="search-facets pt-16 pr-6">
    <data-viewer
      :loading="loading || searchLoading"
      :error="error || searchError"
    >
      <div v-if="computedFacets.length > 0">
        <div v-for="facet in computedFacets" :key="facet.type">
          <custom-header>
            {{ facet.title }}
            <template #info>
              <v-btn
                x-small
                text
                rounded
                color="primary"
                v-if="facet.selected.length > 0"
                @click="facet.selected = []"
              >
                clear
              </v-btn>
            </template>
          </custom-header>
          <v-chip-group
            class="mt-3"
            active-class="primary--text"
            column
            multiple
            v-model="facet.selected"
          >
            <v-chip
              outlined
              small
              v-for="option in facet.options"
              :key="option.key"
              :value="option"
            >
              {{ option.key }} ({{ option.doc_count }})
            </v-chip>
          </v-chip-group>
        </div>
      </div>
      <no-data-state v-else>
        We couldn't find any facets. Starting adding more data to generate
        filter options
      </no-data-state>
    </data-viewer>
  </v-container>
</template>

<script>
import { useSchema } from "@/composables/schema";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useSearch } from "@/composables/search";
import { computed, ref } from "@vue/composition-api";
import CustomHeader from "@/components/Base/CustomHeader";
import NoDataState from "@/components/Base/NoDataState";

export default {
  name: "SearchFacets",
  components: { NoDataState, CustomHeader, DataViewer },
  props: {
    facets: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const computedFacets = computed({
      get: () => props.facets.filter(({ options }) => options?.length > 0),
      set: (val) => emit("update:facets", val),
    });
    const _facets = ref([]);
    const { getAllSchemata, loading, error } = useSchema();
    const { search, loading: searchLoading, error: searchError } = useSearch();
    search("", {
      pageSize: 0,
      //facets: schemata.map(({ schemaName }) => schemaName).join(","),
      facets:
        "entityType, resourceType, assetType, mimeType, systemEntityType,",
    }).then(async ({ facets: fetchedFacets }) => {
      const schemata = await getAllSchemata();
      computedFacets.value = Object.entries(fetchedFacets).map(
        ([key, value]) => ({
          title: schemata.filter(
            ({ schemaName }) => schemaName === key.trim()
          )[0]?.title,
          type: key.trim(),
          options: value?.buckets ?? [],
          selected: [],
        })
      );
    });
    return {
      loading,
      error,
      searchLoading,
      searchError,
      computedFacets,
      _facets: computed(() =>
        _facets.value.filter(({ options }) => options.length > 0)
      ),
    };
  },
};
</script>

<style scoped lang="scss">
.search-facets {
  background-color: white;
  border-right: 1px solid $bg_card_secondary;
}
</style>
