<template>
  <data-fetcher :fetch-method="fetchRecentAddedEntities">
    <div v-if="computedRecentEntities.length > 0">
      <div
        class="my-4 ellipsis"
        v-for="entity in computedRecentEntities"
        :key="entity.id"
      >
        <entity-details-link :id="entity.id">
          {{ entity.title }}
        </entity-details-link>
        <span
          class="d-block font-weight-bold"
          style="color: gray; font-size: 0.8rem"
          >{{ entity.created }}</span
        >
      </div>
    </div>
    <no-data-state v-else />
  </data-fetcher>
</template>

<script>
import DataFetcher from "@/components/DataFetchers/DataFetcher";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "DashboardRecentResources",
  components: { NoDataState, EntityDetailsLink, DataFetcher },
  data: () => ({
    recentEntities: [],
  }),
  computed: {
    computedRecentEntities() {
      return this.recentEntities.filter((entity) => !!entity.title);
    },
  },
  methods: {
    async fetchRecentAddedEntities() {
      return this.$api
        .search("resource", 5)
        .then(
          ({ data: { collection } }) =>
            (this.recentEntities = collection.map(({ doc }) => doc))
        );
    },
  },
};
</script>

<style scoped lang="scss"></style>
