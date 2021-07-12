<template>
  <div class="table-container">
    <v-data-table
      fixed-header
      :headers="headers"
      :items="items"
      hide-default-footer
      :dense="dense"
      class="elevation-0 table-max-height"
    >
      <template slot="items" slot-scope="props">
        <td v-for="(val, i) in props.item" :key="i">{{ val }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "SimpleTable",
  components: {},
  props: ["headers", "items", "dense"],
};
</script>

<style lang="scss" scoped></style>
