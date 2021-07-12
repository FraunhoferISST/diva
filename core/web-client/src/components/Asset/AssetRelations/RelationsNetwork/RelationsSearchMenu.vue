<template>
  <entities-search :result-formatter="searchResultFormatter">
    <template #default="{ search, result, loading }">
      <v-menu v-model="menu" max-width="500px" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn icon rounded class="ma-0" color="success" text v-on="on">
            <v-icon> add </v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-container>
              <v-row>
                <v-col class="pa-3" cols="12" sm="12" md="12">
                  <v-autocomplete
                    clearable
                    dense
                    v-model="model"
                    :items="foundedEntities(result)"
                    :loading="loading"
                    :search-input.sync="searchInput"
                    outlined
                    color="info"
                    label="Add entities to the graph"
                    hide-selected
                    hide-details
                    item-text="doc.title"
                    item-value="doc.id"
                    no-filter
                    multiple
                    placeholder="Start typing to Search"
                    return-object
                    @update:search-input="() => search(searchInput)"
                  >
                    <template v-slot:item="data">
                      <template>
                        <v-list-item-avatar>
                          <identicon :hash="data.item.doc.id"></identicon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>
                            <b>
                              {{
                                data.item.doc.title || data.item.doc.username
                              }}
                            </b>
                          </v-list-item-title>
                          <v-list-item-subtitle
                            v-html="data.item.doc.entityType"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12">
                  <div class="relations-search-selected-items pa-3">
                    <div>
                      <fade-in
                        v-for="item in selectedEntities"
                        :key="item.doc.id"
                      >
                        <relations-search-entity-card :entity="item.doc" />
                      </fade-in>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text color="error" small rounded @click="close"
              >Cancel</v-btn
            >
            <v-btn
              color="primary"
              rounded
              small
              :disabled="selectedEntities.length < 1"
              @click="emitAddNodes"
              >Add selected entities</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
  </entities-search>
</template>

<script>
import RelationsSearchEntityCard from "@/components/Asset/AssetRelations/RelationsSearchEntityCard";
import Identicon from "@/components/Base/Identicon";
import FadeIn from "@/components/Transitions/FadeIn";
import EntitiesSearch from "@/components/DataFetchers/EntitiesSearch";

export default {
  name: "RelationsSearchMenu",
  components: { EntitiesSearch, RelationsSearchEntityCard, Identicon, FadeIn },
  data: () => ({
    menu: false,
    selected: [],
    model: null,
    searchInput: "",
  }),
  watch: {
    model(val) {
      if (val) {
        this.selected = val;
        this.searchInput = "";
        this.model = null;
      }
    },
  },
  computed: {
    selectedEntities() {
      return [...new Set(this.selected)];
    },
  },
  methods: {
    foundedEntities(result) {
      return result.filter(({ doc }) =>
        this.selected.every((selected) => doc.id !== selected.doc.id)
      );
    },
    searchResultFormatter(result) {
      return result.data.collection.filter(
        ({ doc }) => doc.entityType !== "review"
      );
    },
    close() {
      this.selected = [];
      this.entities = [];
      this.search = "";
      this.menu = null;
      this.model = null;
    },
    emitAddNodes() {
      this.$emit(
        "addNodes",
        this.selected.map(({ doc }) => doc)
      );
      this.close();
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
