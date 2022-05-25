<template>
  <v-row dense>
    <v-col cols="12" v-for="(item, i) in formattedValues" :key="i">
      <v-text-field
        v-model="item.value"
        :label="label"
        :placeholder="placeholder"
        outlined
        dense
        rounded
        hide-details
        autofocus
        background-color="transparent"
        @input="onInput"
      >
        <template v-slot:append-outer>
          <v-btn icon small text color="#f86778" @click="onRemove(i)">
            <v-icon small> close </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <v-btn icon small color="primary" @click="onAdd">
        <v-icon small> add </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SourceArrayInput",
  components: {},
  props: {
    label: {
      type: String,
      default: "Add value",
    },
    placeholder: {
      type: String,
      default: "",
    },
    values: {
      type: Array,
      required: true,
    },
    setInitialValue: {
      type: Boolean,
      default: true,
    },
    initialValue: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    menu: false,
  }),
  methods: {
    onRemove(index) {
      if (this.setInitialValue && this.computedValues.length === 1) {
        return;
      }
      this.computedValues.splice(index, 1);
    },
    onAdd() {
      this.computedValues.push("");
    },
    onInput() {
      this.computedValues = this.formattedValues.map(({ value }) => value);
    },
  },
  computed: {
    formattedValues() {
      return this.values.map((value) => ({ value }));
    },
    computedValues: {
      get() {
        return this.values;
      },
      set(value) {
        this.$emit("update:values", value);
      },
    },
  },
  mounted() {
    if (this.setInitialValue && this.values.length === 0) {
      this.computedValues.push(this.initialValue);
    }
  },
};
</script>

<style scoped></style>
