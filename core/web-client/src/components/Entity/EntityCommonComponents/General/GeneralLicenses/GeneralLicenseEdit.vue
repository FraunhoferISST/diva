<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="name"
          label="License name"
          type="text"
          placeholder="Add a title for the license"
          outlined
          dense
          hide-details="auto"
          @input="onEdit"
          clearable
          background-color="transparent"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="url"
          label="License URL"
          placeholder="Specify license URL"
          outlined
          dense
          hide-details="auto"
          :rules="[(value) => !!value || 'required']"
          autofocus
          @input="onEdit"
          clearable
          background-color="transparent"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="code"
          label="License code"
          placeholder="Add a license code"
          outlined
          dense
          hide-details
          @input="onEdit"
          background-color="transparent"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="attributedByText"
          label="License attributed by"
          outlined
          dense
          hide-details
          @input="onEdit"
          background-color="transparent"
        />
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <slot>
          <v-btn rounded small text color="error" @click="emitRemove">
            Remove license
          </v-btn>
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GeneralLicenseEdit",
  components: {},
  props: {
    license: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: this.license.url,
      name: this.license.name,
      code: this.license.code,
      attributedByText: this.license.attributedByText,
    };
  },
  computed: {
    computedLicense: {
      get() {
        return this.license;
      },
      set(val) {
        this.$emit("update:license", val);
      },
    },
  },
  methods: {
    onEdit() {
      this.computedLicense = {
        name: this.name,
        url: this.url,
        code: this.code,
        attributedByText: this.attributedByText,
      };
    },
    emitRemove() {
      this.$emit("remove");
    },
  },
};
</script>

<style scoped></style>
