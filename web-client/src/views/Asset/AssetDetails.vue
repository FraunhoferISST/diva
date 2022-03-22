<template>
  <div>under construction</div>
</template>

<script>
export default {
  name: "AssetDetails",
  components: {},
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
