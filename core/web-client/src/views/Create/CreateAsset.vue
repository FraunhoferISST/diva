<template>
  <v-container fluid class="create-container fill-height">
    <v-row align="center" justify="center">
      <v-col
        cols="12"
        sm="12"
        md="12"
        lg="9"
        xl="7"
        class="elevation-0 create-card pa-0"
      >
        <create-asset-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CreateAssetForm from "@/components/Asset/AssetCreate/CreateAssetForm";
export default {
  name: "CreateAsset",
  components: { CreateAssetForm },
};
</script>

<style scoped></style>
