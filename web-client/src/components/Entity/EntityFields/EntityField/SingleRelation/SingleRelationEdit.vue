<template>
  <v-autocomplete
    dense
    class="custom-autocomplete"
    v-model="computedEntity"
    :loading="loading"
    :items="searchResult"
    :search-input.sync="searchInput"
    chips
    outlined
    placeholder="Search entities"
    background-color="white"
    color="info"
    label="Select Entity"
    hide-selected
    hide-details
    cache-items
    item-text="title"
    item-value="id"
    clearable
    return-object
    @update:search-input="() => searchEntities(searchInput)"
  >
    <template #selection="data">
      <v-chip small :input-value="data.selected">
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
  name: "SingleRelationEdit",
  inheritAttrs: false,
  components: { EntityDetailsLink, EntityAvatar },
  props: {
    id: {
      type: String,
      required: true,
    },
    entity: {
      type: Object,
    },
    entityType: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { search, data, loading, error } = useSearch();
    const searchInput = ref("");
    const computedEntity = computed({
      get() {
        return props.entity;
      },
      set(value) {
        return emit("update:entity", value);
      },
    });
    return {
      loading,
      error,
      searchInput,
      computedEntity,
      searchResult: computed(() => [
        ...(data.value?.collection ?? [])
          .map(({ doc }) => doc)
          .filter((doc) => doc.id !== props.id),
      ]),
      searchEntities: (input) =>
        search(input, {
          pageSize: 30,
          ...props.query,
          entityType: props.entityType,
        }),
    };
  },
};
</script>

<style scoped></style>
