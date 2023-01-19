<template>
  <div
    class="entities-search relative"
    :class="{ 'px-4': menu }"
    v-click-outside="closeMenu"
  >
    <v-fade-transition>
      <div class="search-items-list-container" v-if="menu">
        <div class="px-4">
          <v-chip-group
            @change="onEntityTypesChange"
            multiple
            v-model="selectedEntityTypes"
            active-class="primary--text"
          >
            <v-chip
              x-small
              v-for="type in entityTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </v-chip>
          </v-chip-group>
        </div>
        <div class="search-items-list">
          <v-list v-if="searchResult.length > 0">
            <v-list-item v-for="(item, index) in searchResult" :key="index">
              <v-list-item-avatar>
                <entity-avatar
                  :size="35"
                  :image-id="item.entityIcon"
                  :entity-id="item.id"
                  :entity-title="item.title || item.username"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <entity-details-link :id="item.id" target="_blank">
                    {{ item.title || item.username }}
                  </entity-details-link>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    class="mr-2"
                    x-small
                    label
                    color="#EFF3F7FF"
                    v-for="tag in getEntityTags(item)"
                    :key="tag"
                  >
                    {{ tag }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <slot
                  name="action"
                  :entity="item"
                  :update-entity="
                    (updatedEntity) => updateEntity(index, updatedEntity)
                  "
                >
                </slot>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <div v-else class="pa-12">
            <no-data-state>
              We couldn't find any data. Please try something else
            </no-data-state>
          </div>
          <div v-if="cursor" class="d-flex justify-center pa-3">
            <v-btn
              text
              rounded
              small
              color="primary"
              @click="() => loadNextPage()"
              :loading="loading"
            >
              load more
            </v-btn>
          </div>
        </div>
      </div>
    </v-fade-transition>
    <v-text-field
      class="entities-search-input"
      dense
      v-model="searchInput"
      :loading="loading"
      :items="searchResult"
      outlined
      :placeholder="placeholder"
      background-color="white"
      color="info"
      :label="title"
      hide-details
      clearable
      @focus="() => openMenu()"
      @input="() => onInput()"
    >
    </v-text-field>
  </div>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import { useSearch } from "@/composables/search";
import { computed, ref } from "@vue/composition-api";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import NoDataState from "@/components/Base/NoDataState";
import { Debouncer } from "@/utils/utils";
const searchDebouncer = new Debouncer();

export default {
  name: "EntitiesSearch",
  inheritAttrs: false,
  components: { NoDataState, EntityDetailsLink, EntityAvatar },
  props: {
    title: {
      type: String,
      default: "Search entities",
    },
    placeholder: {
      type: String,
      default: "Search entities by title, description etc.",
    },
    query: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { search, data, loading, error, cursor, loadNextPage } = useSearch();
    const menu = ref(false);
    const searchInput = ref("");
    const entityTypes = ref([
      "resource",
      "user",
      "asset",
      "service",
      "destroyclaim",
      "publisher",
    ]);
    const selectedEntityTypes = ref([...entityTypes.value]);
    const searchEntities = () =>
      search(searchInput.value, {
        pageSize: 20,
        ...props.query,
        ...(selectedEntityTypes.value.length > 0
          ? { entityType: selectedEntityTypes.value.join(",") }
          : {}),
      });
    searchEntities();
    return {
      loading,
      error,
      searchInput,
      entityTypes,
      selectedEntityTypes,
      menu,
      cursor,
      searchResult: computed(() => [
        ...(data.value?.collection ?? []).map(({ doc }) => doc),
      ]),
      openMenu: () => (menu.value = true),
      closeMenu: () => (menu.value = false),
      loadNextPage,
      onInput: () => searchDebouncer.debounce(searchEntities),
      onEntityTypesChange: () => searchDebouncer.debounce(searchEntities),
      updateEntity: (index, entity) =>
        data.value.collection.splice(index, 1, entity),
      getEntityTags: (entity) =>
        [
          entity.entityType,
          entity.resourceType,
          entity.assetType,
          entity.mimeType,
        ]
          .filter((t) => t)
          .map((t) => (t.length > 40 ? `${t.slice(0, 40)}...` : t)),
    };
  },
};
</script>

<style scoped lang="scss">
.entities-search {
  transition: padding 0.3s;
}
.search-items-list-container {
  //background-color: white;
  @include border-radius;
  width: 100%;
  position: absolute;
  left: 0;
  top: -14px;
  padding-top: 58px;
  z-index: 10;
  box-shadow: 0 0.7px 2.2px rgba(0, 0, 0, 0.011),
    0 1.7px 5.3px rgba(0, 0, 0, 0.016), 0 3.1px 10px rgba(0, 0, 0, 0.02),
    0 5.6px 17.9px rgba(0, 0, 0, 0.024), 0 10.4px 33.4px rgba(0, 0, 0, 0.029),
    0 25px 80px rgba(0, 0, 0, 0.04);
}
.search-items-list {
  overflow: auto;
  background-color: white;
  @include border-radius;
  max-height: 300px;
}
.entities-search-input {
  z-index: 11;
}
</style>
