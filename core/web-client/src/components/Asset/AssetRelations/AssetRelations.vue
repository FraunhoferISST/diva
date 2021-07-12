<template>
  <section id="asset-graph">
    <v-container class="grid" fluid>
      <v-row>
        <v-col cols="12">
          <card header="Review and edit asset relations">
            <relations-network slot="body" :id="id" height="700px" />
          </card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import RelationsNetwork from "@/components/Asset/AssetRelations/RelationsNetwork/RelationsNetwork";
import Card from "@/components/Base/Card";

export default {
  name: "AssetRelations",
  components: { Card, RelationsNetwork },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss"></style>
