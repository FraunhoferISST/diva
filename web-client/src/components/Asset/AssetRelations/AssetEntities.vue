<template>
  <section id="asset-edges-list">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <custom-header> Manage entities </custom-header>
        </v-col>
        <v-col cols="12">
          <entities-search />
        </v-col>
      </v-row>
    </v-container>
    <network-edges-list :id="id" edge-types="isPartOf"></network-edges-list>
  </section>
</template>

<script>
import NetworkEdgesList from "@/components/Base/NetworkEdgesList";
import CustomHeader from "@/components/Base/CustomHeader";
import EntitiesSearch from "@/components/Base/EntitiesSearch";

export default {
  name: "AssetRelations",
  components: { EntitiesSearch, CustomHeader, NetworkEdgesList },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss"></style>
