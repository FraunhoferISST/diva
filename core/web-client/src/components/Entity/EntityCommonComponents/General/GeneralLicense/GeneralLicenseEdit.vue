<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" v-for="(item, i) in currentLicenses" :key="i">
        <v-text-field
          v-model="item.value"
          label="Add licenses"
          placeholder="https://license.com"
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
  </v-container>
</template>

<script>
export default {
  name: "GeneralLicenseEdit",
  components: {},
  props: {
    licenses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentLicenses: this.licenses.map((value) => ({ value })),
    };
  },
  methods: {
    onRemove(index) {
      this.currentLicenses.splice(index, 1);
      this.updateLicenses();
    },
    onAdd() {
      this.currentLicenses.push({ value: "" });
      this.updateLicenses();
    },
    onInput() {
      this.updateLicenses();
    },
    updateLicenses() {
      this.$emit("update:licenses", {
        licenses: this.currentLicenses
          .filter((v) => v)
          .map(({ value }) => value),
      });
    },
  },
};
</script>

<style scoped></style>
