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
  name: "SystemEntityDetails",
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
          name: "system_entity_details_general",
        },
        /* {
          title: "Sample",
          icon: "description",
          name: "system_entity_details_sample",
        },*/
        {
          title: "History",
          icon: "history",
          name: "system_entity_details_history",
        },
        {
          title: "Reviews",
          icon: "question_answer",
          name: "system_entity_details_reviews",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>
