<template>
  <v-container class="search-facets pt-md-10 pr-md-6">
    <data-viewer
      :loading="loading || searchLoading"
      :error="error || searchError"
    >
      <div v-if="computedFacets.length > 0">
        <div class="mb-6">
          <!--          <custom-header> Operator </custom-header>-->
          <div class="d-flex justify-center">
            <switch-slider
              :options="[
                { title: 'Should' },
                { title: 'Must' },
                { title: 'Must not' },
              ]"
              :size="60"
              mini
              :selected.sync="computedFacetsOperator"
            />
          </div>
        </div>
        <div class="mb-6" v-for="facet in computedFacets" :key="facet.type">
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
import { computed } from "@vue/composition-api";
import CustomHeader from "@/components/Base/CustomHeader";
import NoDataState from "@/components/Base/NoDataState";
import SwitchSlider from "@/components/Base/SwitchSlider";

export default {
  name: "SearchFacets",
  components: { SwitchSlider, NoDataState, CustomHeader, DataViewer },
  props: {
    facets: {
      type: Array,
    },
    facetsOperator: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const computedFacetsOperator = computed({
      get: () => props.facetsOperator,
      set: (val) => emit("update:facetsOperator", val),
    });
    const computedFacets = computed({
      get: () => props.facets.filter(({ options }) => options?.length > 0),
      set: (val) => emit("update:facets", val),
    });
    const { getAllSchemata, loading, error } = useSchema();
    const { search, loading: searchLoading, error: searchError } = useSearch();
    getAllSchemata().then(async (schemata) => {
      const relevantFieldsSchemata = schemata.filter(
        ({ schemaName, schema }) => {
          if (schemaName === "entity") {
            return false;
          }
          const parsedSchema = JSON.parse(schema);
          const fieldNameDefinition = parsedSchema.properties[schemaName] ?? {};
          return (
            fieldNameDefinition?._elasticsearch?.type === "keyword" ||
            fieldNameDefinition?.items?._elasticsearch?.type === "keyword"
          );
        }
      );
      const { facets: fetchedFacets } = await search("", {
        pageSize: 0,
        facets: relevantFieldsSchemata
          .map(({ schemaName }) => schemaName)
          .join(","),
      });
      computedFacets.value = Object.entries(fetchedFacets).map(
        ([key, value]) => ({
          title: relevantFieldsSchemata.filter(
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
      computedFacetsOperator,
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
