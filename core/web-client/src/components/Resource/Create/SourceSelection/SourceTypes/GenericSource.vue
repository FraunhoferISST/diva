<template>
  <v-container class="pa-0 fluid fill-height">
    <v-row>
      <v-col cols="12">
        <custom-header text="Specify a title for the new generic resource" />
      </v-col>
      <v-col cols="12">
        <source-text-input
          label="Resource title"
          :value.sync="genericResource.title"
        />
      </v-col>
      <v-col cols="12">
        <v-alert text dense type="info">
          Later you can assign a specific type to this resource and add more
          data to it
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import SourceTextInput from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceTextInput";
export default {
  name: "UrbanPulseSource",
  components: {
    SourceTextInput,
    CustomHeader,
  },
  props: {
    source: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    genericResource: {
      title: "",
      resourceType: "generic",
      entityType: "resource",
    },
  }),
  watch: {
    isReady() {
      this.computedSource.isReady = this.isReady;
    },
  },
  computed: {
    isReady() {
      return !!this.genericResource.title;
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
      return this.$api.resources.create(this.genericResource);
    },
  },
  mounted() {
    this.computedSource.onCreate = this.create;
  },
};
</script>

<style scoped lang="scss"></style>
