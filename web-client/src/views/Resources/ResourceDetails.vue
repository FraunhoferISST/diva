<template>
  <entity-details-container :id="id" :links="links">
    <router-transition>
      <router-view :key="$route.params.id"></router-view>
    </router-transition>
  </entity-details-container>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import EntityDetailsContainer from "@/components/Entity/EntityDetailsContainer";
export default {
  name: "ResourceDetails",
  components: {
    EntityDetailsContainer,
    RouterTransition,
  },
  props: ["id"],
  data() {
    return {
      links: [
        {
          title: "Overview",
          icon: "short_text",
          name: "resource_details_general",
        },
        {
          title: "Costs",
          icon: "attach_money",
          name: "resource_details_costs",
        },
        {
          title: "Profiling",
          icon: "developer_board",
          name: "resource_details_profiling",
        },
        {
          title: "Sample",
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
}
</style>
