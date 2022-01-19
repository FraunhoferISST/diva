<template>
  <entity-base-data-fetcher :id="id">
    <template #default="{ data, api }">
      <section class="resource-details">
        <entity-details-navigation
          :data="data"
          :entityApi="api"
          :links="links"
          :hash="id"
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
  name: "ResourceDetails",
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
          name: "resource_details_general",
        },
        {
          title: "Costs",
          icon: "attach_money",
          name: "resource_details_costs",
        },
        {
          title: "Data Profiling",
          icon: "developer_board",
          name: "resource_details_profiling",
        },
        {
          title: "Sample Data",
          icon: "description",
          name: "resource_details_sample",
        },
        {
          title: "History",
          icon: "history",
          name: "resource_details_history",
        },
        {
          title: "Reviews",
          icon: "question_answer",
          name: "resource_details_reviews",
        },
        {
          title: "IDS",
          icon: "$vuetify.icons.ids",
          name: "resource_details_ids",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.resource-details {
  position: relative;
  background-color: transparent;
  display: grid;
  grid-template-columns: minmax(80px, max-content) minmax(50px, 1fr);
  grid-column-gap: 0;
  height: 100%;
  padding-bottom: 100px;
}
</style>
