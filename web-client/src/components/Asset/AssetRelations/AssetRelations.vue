<template>
  <section id="asset-graph">
    <relations-network slot="body" :id="id" height="700px" />
  </section>
</template>

<script>
import RelationsNetwork from "@/components/Asset/AssetRelations/RelationsNetwork/RelationsNetwork";

export default {
  name: "AssetRelations",
  components: { RelationsNetwork },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss"></style>
