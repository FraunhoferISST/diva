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
import fetchWrapper from "@/api/fetchWrapper";

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
    async create() {
      this.computedSource.resources = [];
      this.computedSource.totalCount = null;
      this.computedSource.processedCount = null;
      const data = { ...this.credentials };
      if (
        this.onlySpecificSensors &&
        this.sensors.filter((s) => !!s).length > 0
      ) {
        data.sensors = this.sensors;
      }
      this.computedSource.resources = [
        {
          title: "Importing your UrbanPulse data",
          loading: true,
          imported: false,
        },
      ];
      const decoder = new TextDecoder("utf-8");
      const controller = new AbortController();
      const signal = controller.signal;
      this.computedSource.onCancel = () => controller.abort();
      const response = await fetchWrapper
        .fetch("/urbanPulseAdapter/import?streamResponse=true", data, signal)
        .catch(() => this.processStreamResponseError(response, "{}"));
      const reader = response.body.getReader();
      if (response.ok) {
        let isReaderDone = false;
        while (!isReaderDone) {
          const { value, done } = await reader.read();
          isReaderDone = done;
          if (value) {
            this.processStreamResponse(decoder.decode(value));
          }
        }
        this.computedSource.resources[0].loading = false;
        this.computedSource.resources[0].imported = true;
      } else {
        const { value } = await reader.read();
        this.processStreamResponseError(response, decoder.decode(value));
      }
    },
    processStreamResponse(data) {
      try {
        const { totalCount, processedCount } = JSON.parse(data);
        this.computedSource.totalCount = totalCount;
        this.computedSource.processedCount = processedCount;
        this.computedSource.resources[0].title = `Found ${totalCount} sensors to import`;
      } catch {
        // just need some code here
        this.computedSource.resources[0].title = `Still importing sensors`;
      }
    },
    processStreamResponseError(response, data) {
      let errorMessage = "Some error occurred";
      try {
        const error = JSON.parse(data);
        errorMessage = error.message;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      this.computedSource.resources[0].loading = false;
      this.computedSource.resources[0].error = errorMessage;
      throw errorMessage;
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
