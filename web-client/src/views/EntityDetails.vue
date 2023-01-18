<template>
  <entity-details-container :id="id" :routes="routes">
    <router-transition>
      <router-view :key="$route.params.id"></router-view>
    </router-transition>
  </entity-details-container>
</template>

<script>
import RouterTransition from "@/components/Transitions/RouterTransition";
import EntityDetailsContainer from "@/components/Entity/EntityDetailsContainer";
export default {
  name: "EntityDetails",
  components: {
    EntityDetailsContainer,
    RouterTransition,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    routes: {
      type: Array,
      default: () => [
        {
          title: "Overview",
          icon: "short_text",
          name: "entity_details_general",
        },
        {
          title: "Details",
          icon: "short_text",
          name: "entity_details_general_details",
        },
        {
          title: "History",
          icon: "history",
          name: "entity_details_history",
        },
        {
          title: "Reviews",
          icon: "question_answer",
          name: "entity_details_reviews",
        },
        {
          title: "Data Network",
          icon: "insights",
          name: "entity_details_datanetwork",
        },
      ],
    },
  },
};
</script>

<style scoped lang="scss"></style>
