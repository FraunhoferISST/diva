<template>
  <v-container class="pa-0 fluid">
    <v-row>
      <v-col cols="12">
        <custom-header text="Specify URL of new GitHub Project" />
      </v-col>
      <v-col cols="12">
        <v-row dense v-for="(resource, i) in computedSource.resources" :key="i">
          <v-col cols="12" :md="12">
            <div class="d-flex align-center pb-2">
              <source-text-input
                label="GitHub Project URL"
                :value.sync="resource.gitHubProjectUrl"
                :rules="urlValidationRules"
              />
              <v-tooltip top open-delay="600" max-width="400px" v-if="i === 0">
                <template #activator="{ on, attrs }">
                  <v-icon color="primary" large v-bind="attrs" v-on="on">
                    info_outline
                  </v-icon>
                </template>
                <span>E.g. "https://github.com/myuser/myproject"</span>
              </v-tooltip>
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
          Your can add multiple GitHub Projects at once. We require just a
          project URL. Later you can enrich it with more useful metadata.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import SourceTextInput from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceTextInput";
export default {
  name: "GitHubAccountSource",
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
    gitLabAccountResource: {
      title: "",
      gitHubProjectUrl: "",
      resourceType: "github:project",
      entityType: "resource",
      error: "",
      warning: "",
      imported: false,
      loading: true,
    },
    urlValidationRules: [
      (value) => !!value || "GitHub Project URL is required",
      (value) => {
        let url;
        try {
          url = new URL(value);
        } catch (_) {
          return false;
        }
        const gitHubTest = url.hostname.includes("github.com");
        return (
          (gitHubTest && url.protocol === "http:") ||
          (gitHubTest && url.protocol === "https:") ||
          "GitHub URL is not valid"
        );
      },
    ],
  }),
  watch: {
    isReady() {
      this.computedSource.isReady = this.isReady;
    },
  },
  computed: {
    isReady() {
      return this.computedSource.resources.every(
        ({ gitHubProjectUrl }) => gitHubProjectUrl
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
      return Promise.all(
        this.computedSource.resources.map((resource) => {
          resource.loading = true;
          resource.imported = false;
          resource.warning = "";
          resource.error = "";

          const { gitHubProjectUrl, resourceType, entityType } = resource;
          resource.title = gitHubProjectUrl;
          return this.$api.resources
            .create({
              title: gitHubProjectUrl,
              gitHubProjectUrl,
              resourceType,
              entityType,
            })
            .then(({ data }) => {
              resource.id = data;
              resource.imported = true;
            })
            .catch((e) => {
              resource.error =
                e?.response?.data?.message ??
                e?.message ??
                "Some error occurred";
            })
            .finally(() => {
              resource.loading = false;
            });
        })
      );
    },
    onAdd() {
      this.computedSource.resources.push({ ...this.gitLabAccountResource });
    },
    onRemoveTab(i) {
      this.computedSource.resources.splice(i, 1);
    },
  },
  mounted() {
    this.computedSource.onCreate = this.create;
    this.computedSource.resources = [{ ...this.gitLabAccountResource }];
  },
};
</script>

<style scoped lang="scss"></style>
