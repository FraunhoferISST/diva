<template>
  <v-menu :close-on-content-click="true" transition="scale-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="computedDate"
        :label="label"
        readonly
        outlined
        rounded
        dense
        v-bind="attrs"
        v-on="on"
        clearable
        hide-details
      ></v-text-field>
    </template>
    <v-date-picker color="#2e2bef" v-model="computedDate" no-title scrollable>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "SourceDatePicker",
  components: {},
  props: {
    label: {
      type: String,
      default: "Select date",
    },
    date: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    computedDate: {
      get() {
        return this.formatDate(this.date);
      },
      set(value) {
        this.$emit("update:date", new Date(value).toISOString());
      },
    },
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toISOString().substr(0, 10) : "";
    },
  },
};
</script>

<style scoped></style>
