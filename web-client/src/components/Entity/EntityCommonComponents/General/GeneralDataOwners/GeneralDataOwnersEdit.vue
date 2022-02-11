<template>
  <div class="general-title-edit-container">
    <v-col cols="12">
      <edit-activate-transition>
        <v-autocomplete
          dense
          class="custom-autocomplete"
          v-model="computedOwners"
          :disabled="isLoading"
          :loading="isLoading"
          :search-input.sync="search"
          :items="users"
          chips
          outlined
          placeholder="Search by name"
          background-color="transparent"
          color="info"
          label="Select Owner"
          hide-selected
          hide-details
          small-chips
          item-text="username"
          item-value="id"
          clearable
          multiple
          @update:search-input="searchUsers"
        >
          <template #selection="data">
            <v-chip small :input-value="data.selected" class="ma-0 pa-0">
              <user-avatar
                :size="5"
                :image-id="data.item.entityIcon"
                class="mr-2"
              />
              <span class="pr-2">
                {{ data.item.username }}
              </span>
            </v-chip>
          </template>
          <template #item="data">
            <template>
              <v-list-item-avatar>
                <user-avatar :size="35" :image-id="data.item.entityIcon" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ data.item.username }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ data.item.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </edit-activate-transition>
    </v-col>
  </div>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
import UserAvatar from "@/components/User/UserAvatar";

export default {
  name: "GeneralDataOwnerEdit",
  components: { UserAvatar, EditActivateTransition },
  props: {
    owners: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      search: "",
      users: [],
    };
  },
  computed: {
    computedOwners: {
      get() {
        return this.owners;
      },
      set(value) {
        this.$emit("update:owners", { owners: value });
      },
    },
  },
  methods: {
    searchUsers() {
      this.$api
        .search(this.search, 100)
        .then(({ data: { collection } }) => {
          this.users = collection
            .filter(({ doc }) => doc.entityType === "user")
            .map(({ doc }) => doc);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  mounted() {
    this.searchUsers();
  },
};
</script>

<style scoped></style>
