<template>
  <v-container class="pa-0 fluid">
    <v-row>
      <v-col cols="12">
        <custom-header text="Specify Names and UUIDs for new VMWare VMs" />
      </v-col>
      <v-col cols="12">
        <v-row dense v-for="(resource, i) in computedSource.resources" :key="i">
          <v-col cols="6" :md="6">
            <div class="d-flex align-center pb-5">
              <source-text-input
                label="VMWare VM name"
                :value.sync="resource.title"
              />
              <v-tooltip top open-delay="600" max-width="400px">
                <template #activator="{ on, attrs }">
                  <v-icon color="primary" large v-bind="attrs" v-on="on">
                    info_outline
                  </v-icon>
                </template>
                <span>should be the same name as used in the VM</span>
              </v-tooltip>
            </div>
          </v-col>
          <v-col cols="6" :md="6">
            <div class="d-flex align-center">
              <source-text-input
                label="VMWare VM uuid"
                :value.sync="resource.vmwareUuid"
              />
              <v-tooltip top open-delay="600" max-width="400px">
                <template #activator="{ on, attrs }">
                  <v-icon color="primary" large v-bind="attrs" v-on="on">
                    info_outline
                  </v-icon>
                </template>
                <span
                  >UUID must look like this: 56 4d d1 4a 8e 46 d6 79-87 7c dc 0d
                  d7 4f ef e9</span
                >
              </v-tooltip>
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
          Your can add multiple VMs at once. We require a name and a uuid to
          inventory a VM. Later you can enrich it with more useful metadata.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import SourceTextInput from "@/components/Resource/Create/SourceSelection/SourceCreationFields/SourceTextInput";
export default {
  name: "VMWareSource",
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
    vmwareVmResource: {
      title: "",
      vmwareUuid: "",
      resourceType: "vmware:vm",
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
          const { title, vmwareUuid, resourceType, entityType } = resource;
          return this.$api.resources
            .create({ title, vmwareUuid, resourceType, entityType })
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
      this.computedSource.resources.push({ ...this.vmwareVmResource });
    },
    onRemoveTab(i) {
      this.computedSource.resources.splice(i, 1);
    },
  },
  mounted() {
    this.computedSource.onCreate = this.create;
    this.computedSource.resources = [{ ...this.vmwareVmResource }];
  },
};
</script>

<style scoped lang="scss"></style>
