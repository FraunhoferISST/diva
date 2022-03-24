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
    background-color="transparent"
    color="info"
    label="Select Owner"
    hide-selected
    hide-details
    small-chips
    cache-items
    no-filter
    item-text="username"
    item-value="id"
    clearable
    multiple
    @update:search-input="() => search(searchInput, 50)"
  >
    <template #selection="data">
      <v-chip small :input-value="data.selected" class="ma-0 pa-0">
        <entity-avatar
          :size="5"
          :image-id="data.item.entityIcon"
          :entity-id="data.item.id"
          :entity-title="data.item.username"
          class="mr-2"
        />
        <span class="pr-2">
          {{ data.item.username }}
        </span>
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

export default {
  name: "OwnerEdit",
  inheritAttrs: false,
  components: { EntityAvatar },
  props: {
    owners: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const { search, data, loading, error } = useSearch();
    const searchInput = ref("");
    // search("", 100);
    return {
      search,
      searchResult: computed(() =>
        (data.value?.collection ?? [])
          .filter(({ doc }) => doc.entityType === "user")
          .map(({ doc }) => doc)
      ),
      loading,
      error,
      searchInput,
    };
  },
  computed: {
    computedOwners: {
      get() {
        return this.owners;
      },
      set(value) {
        this.$emit("update:owners", value);
      },
    },
  },
};
</script>

<style scoped></style>
