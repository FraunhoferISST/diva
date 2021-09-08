<template>
  <v-container class="py-0 fluid">
    <source-credentials
      :credentials.sync="credentials"
      title="Import data from your UP instance"
    />
    <v-row>
      <v-col cols="6" sm="6" md="6">
        <source-date-picker
          :date.sync="credentials.since"
          label="Set since date"
        />
      </v-col>
      <v-col cols="6" sm="6" md="6">
        <source-date-picker
          :date.sync="credentials.until"
          label="Set until date"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <check-box-card
          title="Import only specific sensors"
          @change="onCheckBoxCardChange"
        >
          <template #default="{ checked }">
            <p class="mb-0">
              Specify one or more sensors id's that should be imported. This is
              optional and, if no sensors specified, all available sensors on
              the provided instance will be imported
            </p>
            <source-array-input
              class="mt-4"
              v-if="checked"
              :values.sync="sensors"
              label="Add sensor id"
              placeholder="88b9abb0-dab5-4ad0-a41b-4d00374b7fc5"
            />
          </template>
        </check-box-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SourceCredentials from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceCredentials";
import SourceDatePicker from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceDatePicker";
import CheckBoxCard from "@/components/Base/CheckBoxCard";
import SourceArrayInput from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceArrayInput";
export default {
  name: "UrbanPulseSource",
  components: {
    SourceArrayInput,
    CheckBoxCard,
    SourceDatePicker,
    SourceCredentials,
  },
  props: {
    source: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    credentials: {
      baseUrl: "",
      username: "",
      password: "",
      since: "",
      until: "",
    },
    sensors: [],
    onlySpecificSensors: false,
  }),
  watch: {
    isReady() {
      this.computedSource.isReady = this.isReady;
    },
  },
  computed: {
    isReady() {
      return (
        Object.keys(this.credentials).every((key) => this.credentials[key]) &&
        (!this.onlySpecificSensors ||
          this.sensors.every((sensorId) => sensorId))
      );
    },
    computedSource: {
      get() {
        return this.source;
      },
      set(val) {
        this.$emit("update:source", val);
      },
    },
  },
  methods: {
    create() {
      const data = { ...this.credentials };
      if (
        this.onlySpecificSensors &&
        this.sensors.filter((s) => !!s).length > 0
      ) {
        data.sensors = this.sensors;
      }
      return this.$api.urbanPulseAdapter.import(data);
    },
    onCheckBoxCardChange(isChecked) {
      this.onlySpecificSensors = isChecked;
    },
  },
  mounted() {
    this.computedSource.onCreate = this.create;
  },
};
</script>

<style scoped lang="scss"></style>
