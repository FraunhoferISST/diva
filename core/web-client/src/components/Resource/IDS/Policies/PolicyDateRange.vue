<template>
  <v-row>
    <v-col class="pb-0" v-for="key in dateRangeDates" :key="key">
      <v-menu
        :close-on-content-click="true"
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :value="formatDate(computedDateRange[key])"
            readonly
            dense
            v-on="on"
            :label="key"
            rounded
            required
            :rules="validationRules"
            outlined
            hide-details
            :disabled="disabled"
          ></v-text-field>
        </template>
        <v-date-picker
          color="#2e2bef"
          no-title
          header-color="transparent"
          :value="formatDate(computedDateRange[key])"
          :min="key === 'to' ? computedDateRange['from'] : ''"
          :max="key === 'from' ? computedDateRange['to'] : ''"
          @change="(date) => setDate(key, date)"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "PolicyDateRange",
  components: {},
  props: {
    dateRange: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    timeWindowDatePicker: null,
    validationRules: [(v) => !!v || "Field is required"],
  }),
  computed: {
    computedDateRange: {
      get() {
        return this.dateRange;
      },
      set(value) {
        this.$emit("update:dateRange", value);
      },
    },
    dateRangeDates() {
      return Object.keys(this.computedDateRange);
    },
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toISOString().substr(0, 10) : "";
    },
    setDate(key, date) {
      this.computedDateRange[key] = new Date(date).toISOString();
      this.$emit("input");
    },
  },
};
</script>

<style scoped></style>
