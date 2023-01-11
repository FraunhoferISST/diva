<template>
  <v-autocomplete
    dense
    class="custom-autocomplete"
    v-model="computedResources"
    :loading="loading"
    :items="searchResult"
    :search-input.sync="searchInput"
    chips
    outlined
    placeholder="Search resources"
    background-color="white"
    color="info"
    label="Select Resource"
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
          :entity-title="data.item.title"
          class="mr-2"
          style="margin-left: -12px"
        />
        <entity-details-link class="pr-2" :id="data.item.id" target="_blank">
          {{ data.item.title }}
        </entity-details-link>
      </v-chip>
    </template>
    <template #item="data">
      <v-list-item-avatar>
        <entity-avatar
          :size="35"
          :image-id="data.item.entityIcon"
          :entity-id="data.item.id"
          :entity-title="data.item.title"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ data.item.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ data.item.entityType }}
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
  name: "DestroyClaimRefersToEdit",
  inheritAttrs: false,
  components: { EntityDetailsLink, EntityAvatar },
  props: {
    resources: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { search, data, loading, error } = useSearch();
    const searchInput = ref("");
    const computedResources = computed({
      get() {
        return props.resources;
      },
      set(value) {
        return emit("update:resources", value);
      },
    });
    return {
      loading,
      error,
      searchInput,
      computedResources,
      searchResult: computed(() => [
        ...computedResources.value,
        ...(data.value?.collection ?? []).map(({ doc }) => doc),
      ]),
      searchEntities: (input) =>
        search(input, { pageSize: 30, ...props.query, entityType: "resource" }),
      removeSelected(item) {
        const deleteIndex = computedResources.value.findIndex(
          ({ id }) => item.id === id
        );
        computedResources.value.splice(deleteIndex, 1);
      },
    };
  },
};
</script>

<style scoped></style>
