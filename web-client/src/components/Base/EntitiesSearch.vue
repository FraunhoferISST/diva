<template>
  <v-autocomplete
    dense
    class="custom-autocomplete"
    v-model="selected"
    :loading="loading"
    :items="searchResult"
    :search-input.sync="searchInput"
    chips
    outlined
    placeholder="Search users"
    background-color="white"
    color="info"
    label="Select Owner"
    hide-selected
    hide-details
    small-chips
    cache-items
    item-text="title"
    item-value="id"
    clearable
    deletable-chips
    multiple
    return-object
    @update:search-input="() => searchEntities(searchInput)"
  >
    <template #selection="data">
      <v-chip
        small
        :input-value="data.selected"
        close
        @click:close="() => removeSelected(data.item)"
      >
        <entity-avatar
          :size="5"
          :image-id="data.item.entityIcon"
          :entity-id="data.item.id"
          :entity-title="data.item.username"
          class="mr-2"
          style="margin-left: -12px"
        />
        <entity-details-link class="pr-2" :id="data.item.id" target="_blank">
          {{ data.item.username }}
        </entity-details-link>
      </v-chip>
    </template>
    <template #item="data">
      <v-list-item-avatar>
        <entity-avatar
          :size="35"
          :image-id="data.item.entityIcon"
          :entity-id="data.item.id"
          :entity-title="data.item.username"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ data.item.username }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ data.item.email }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import EntityAvatar from "@/components/Entity/EntityAvatar";
import { useSearch } from "@/composables/search";
import { computed, ref } from "@vue/composition-api";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";

export default {
  name: "EntitiesSearch",
  inheritAttrs: false,
  components: { EntityDetailsLink, EntityAvatar },
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { search, data, loading, error } = useSearch();
    const searchInput = ref("");
    const selected = ref([]);
    return {
      loading,
      error,
      searchInput,
      selected,
      searchResult: computed(() => [
        ...(data.value?.collection ?? []).map(({ doc }) => doc),
      ]),
      removeSelected(item) {
        const deleteIndex = selected.value.findIndex(
          ({ id }) => item.id === id
        );
        selected.value.splice(deleteIndex, 1);
      },
      searchEntities: (input) =>
        search(input, { pageSize: 30, ...props.query }),
    };
  },
};
</script>

<style scoped></style>
