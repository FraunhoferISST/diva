<template>
  <entity-details-container :id="id" :links="links">
    <router-transition>
      <router-view :key="$route.params.id"></router-view>
    </router-transition>
  </entity-details-container>
</template>

<script>
import EntityDetailsContainer from "@/components/Entity/EntityDetailsContainer";
import RouterTransition from "@/components/Transitions/RouterTransition";
export default {
  name: "AssetDetails",
  components: { RouterTransition, EntityDetailsContainer },
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

<style scoped lang="scss"></style>
