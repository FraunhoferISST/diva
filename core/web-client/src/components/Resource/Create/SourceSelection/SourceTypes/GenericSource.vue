<template>
  <v-container class="pa-0 fluid">
    <v-row>
      <v-col cols="12">
        <custom-header text="Specify titles for new generic resources" />
      </v-col>
      <v-col cols="12">
        <v-row dense>
          <v-col
            cols="12"
            :md="computedSource.resources.length > 1 ? '6' : '12'"
            v-for="(resource, i) in computedSource.resources"
            :key="i"
          >
            <div class="d-flex align-center">
              <source-text-input
                label="Resource title"
                :value.sync="resource.title"
              />
              <div class="pl-2" v-if="computedSource.resources.length > 1">
                <v-btn icon color="error" @click="() => onRemoveTab(i)">
                  <v-icon small color="error"> close </v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-btn icon color="primary">
          <v-icon dense color="primary" @click="onAdd"> add </v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-alert text dense type="info" class="ma-0">
          Your can add multiple resources at once. We require only a title to
          create new generic resource. Later you can enrich it with more useful
          metadata.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import SourceTextInput from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceTextInput";
export default {
  name: "GenericSource",
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
      error: "",
      warning: "",
      imported: false,
      loading: true,
    },
  }),
  watch: {
    isReady() {
      this.computedSource.isReady = this.isReady;
    },
  },
  computed: {
    isReady() {
      return this.computedSource.resources.every(({ title }) => title);
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
      return Promise.all(
        this.computedSource.resources.map((resource) => {
          resource.loading = true;
          resource.imported = false;
          resource.warning = "";
          resource.error = "";
          const { title, resourceType, entityType } = resource;
          return this.$api.resources
            .create({ title, resourceType, entityType })
            .then(({ data }) => {
              resource.id = data;
              resource.imported = true;
            })
            .catch((e) => {
              if (e?.response?.data?.code === 409) {
                resource.warning = e?.response?.data?.message;
                resource.imported = true;
              } else {
                resource.error = e?.response?.data?.message;
              }
            })
            .finally(() => {
              resource.loading = false;
            });
        })
      );
    },
    onAdd() {
      this.computedSource.resources.push({ ...this.genericResource });
    },
    onRemoveTab(i) {
      this.computedSource.resources.splice(i, 1);
    },
  },
  mounted() {
    this.computedSource.onCreate = this.create;
    this.computedSource.resources = [{ ...this.genericResource }];
  },
};
</script>

<style scoped lang="scss"></style>
