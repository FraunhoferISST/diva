<template>
  <entity-base-data-fetcher :id="id">
    <template #default="{ data, api }">
      <section class="asset-details">
        <entity-details-navigation
          :data="data"
          :entity-api="api"
          :links="links"
          :id="id"
        />
        <div class="px-md-0 px-lg-8 px-xl-8">
          <router-transition>
            <router-view></router-view>
          </router-transition>
        </div>
      </section>
    </template>
  </entity-base-data-fetcher>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import EntityDetailsNavigation from "@/components/Entity/EntityDetailsNavigation";
import EntityBaseDataFetcher from "@/components/DataFetchers/EntityBaseDataFetcher";
export default {
  name: "AssetDetails",
  components: {
    EntityBaseDataFetcher,
    EntityDetailsNavigation,
    RouterTransition,
  },
  props: ["id"],
  data() {
    return {
      links: [
        {
          title: "General",
          icon: "short_text",
          name: "asset_details_general",
        },
        {
          title: "Costs",
          icon: "attach_money",
          name: "asset_details_costs",
        },
        {
          title: "History",
          icon: "history",
          name: "asset_details_history",
        },
        {
          title: "Reviews",
          icon: "question_answer",
          name: "asset_details_reviews",
        },
        {
          title: "Relations",
          icon: "timeline",
          name: "asset_details_relations",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.asset-details {
  position: relative;
  background-color: transparent;
  display: grid;
  grid-template-columns: minmax(80px, max-content) minmax(50px, 1fr);
  grid-column-gap: 0;
  height: 100%;
  padding-bottom: 100px;
}
</style>
