<template>
  <v-autocomplete
    v-model="selected_columns_ids"
    :items="columns"
    chips
    color="info"
    label="Filter Columns"
    item-text="title"
    item-value="id"
    multiple
    hide-details
    hide-selected
    dense
    flat
    outlined
    clearable
    @input="$emit('selected', selected_columns_ids)"
  >
    <template slot="selection" slot-scope="data">
      <v-chip
        :input-value="data.selected"
        close
        small
        class="chip--select-multi"
        @click:close="removeSelectedColumn(data.item.id)"
      >
        {{ data.item.title }}
      </v-chip>
    </template>
    <template slot="item" slot-scope="data">
      <template>
        <v-list-item-content v-text="data.item.title"></v-list-item-content>
      </template>
    </template>
    <template slot="no-data">
      <no-data-state text="No columns found" />
    </template>
  </v-autocomplete>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "ProfilingTableAutocomplete",
  components: { NoDataState },
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selected_columns_ids: [],
  }),
  methods: {
    removeSelectedColumn(item) {
      const index = this.selected_columns_ids.indexOf(item);
      if (index >= 0) this.selected_columns_ids.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
