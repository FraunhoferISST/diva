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
          name: "user_details_general",
        },
        {
          title: "History",
          icon: "history",
          name: "user_details_history",
        },
        {
          title: "Collections",
          icon: "add",
          name: "user_details_collections",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>
