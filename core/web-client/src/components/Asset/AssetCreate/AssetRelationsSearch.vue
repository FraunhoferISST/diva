<template>
  <v-row>
    <v-col cols="12" sm="12" md="6" offset="0" offset-sm="0" offset-md="3">
      <v-autocomplete
        v-model="model"
        :items="entities"
        :loading="loading"
        :search-input.sync="search"
        box
        color="info"
        label="Select enteties"
        hide-selected
        hide-details
        item-text="title"
        item-value="resourceHash"
        no-filter
        outline
        placeholder="Start typing to Search"
        return-object
      >
        <template v-slot:item="data">
          <template>
            <v-list-tile-avatar>
              <identicon
                :hash="data.item.resourceHash || data.item.id"
              ></identicon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.title"></v-list-tile-title>
              <v-list-tile-sub-title
                v-html="data.item.filename"
              ></v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="12">
      <div class="create-asset-selected-items pa-3">
        <div class="text-center pb-3 font-weight-bold">
          <p class="ma-0">Selected entities will be added to the asset</p>
        </div>
        <div>
          <fade-in v-for="item in selectedEntities" :key="item.id">
            <asset-create-entity-card
              :entity="item"
              @remove="removeSelectedEntity"
            />
          </fade-in>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import AssetCreateEntityCard from "@/components/Asset/AssetCreate/AssetCreateEntityCard";
import Identicon from "@/components/Base/Identicon";
import FadeIn from "@/components/Transitions/FadeIn";

export default {
  name: "AssetRelationsSearch",
  components: { FadeIn, Identicon, AssetCreateEntityCard },
  data: () => ({
    selected: [],
    model: null,
    search: "",
    loading: false,
    entities: [],
  }),
  watch: {
    model(val) {
      this.selected.push(val);
      this.search = "";
    },
  },
  computed: {
    selectedEntities() {
      return [...new Set(this.selected)];
    },
  },
  methods: {
    removeSelectedEntity(hash) {
      this.selected = this.selected.filter(
        (entity) => entity.resourceHash !== hash
      );
    },
  },
};
</script>

<style scoped lang="scss">
.create-asset-selected-items {
  @include border-radius-half;
  // @include gradient-primary(0.1, 0.1);
}
</style>
