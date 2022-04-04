<template>
  <v-autocomplete
    dense
    class="custom-autocomplete"
    v-model="computedOwners"
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
    item-text="username"
    item-value="id"
    clearable
    deletable-chips
    multiple
    return-object
    @update:search-input="() => searchUsers(searchInput)"
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
  name: "OwnerEdit",
  inheritAttrs: false,
  components: { EntityDetailsLink, EntityAvatar },
  props: {
    owners: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { search, data, loading, error } = useSearch();
    const searchInput = ref("");
    const computedOwners = computed({
      get() {
        return props.owners;
      },
      set(value) {
        return emit("update:owners", value);
      },
    });
    return {
      loading,
      error,
      searchInput,
      computedOwners,
      searchResult: computed(() => [
        ...computedOwners.value,
        ...(data.value?.collection ?? []).map(({ doc }) => doc),
      ]),
      searchUsers: (input) =>
        search(input, { pageSize: 50, entityType: "user" }),
      removeSelected(item) {
        const deleteIndex = computedOwners.value.findIndex(
          ({ id }) => item.id === id
        );
        computedOwners.value.splice(deleteIndex, 1);
      },
    };
  },
};
</script>

<style scoped></style>
