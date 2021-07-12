<template>
  <div class="create-result-overlay-container" :class="{ open: open }">
    <div class="create-result-overlay-btn">
      <v-btn color="error" text @click="close">
        <v-icon small> close </v-icon>
      </v-btn>
    </div>
    <v-container fluid class="pa-12">
      <v-row>
        <v-col cols="12">
          <v-alert text type="info">
            The import of the specified data source was successfully executed.
            You can find the resource on the
            <router-link to="/search">search</router-link> page or navigate
            directly with the links below
          </v-alert>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4">
          <v-alert outlined dense type="success">
            Imported {{ imported }}
          </v-alert>
        </v-col>
        <v-col cols="4">
          <v-alert outlined dense type="warning">
            Warnings {{ warnings }}
          </v-alert>
        </v-col>
        <v-col cols="4">
          <v-alert outlined dense type="error"> Errors {{ errors }} </v-alert>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <sub-header :text="resourcesIdsTitle" />
        </v-col>
        <v-col cols="12" v-for="id in resourcesIds" :key="id">
          <entity-details-link target="_blank" :id="id">
            {{ id }}
          </entity-details-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import SubHeader from "@/components/Base/SubHeader";
export default {
  name: "CreateResultOverlay",
  components: { SubHeader, EntityDetailsLink },
  props: {
    response: {
      type: Object,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedOpen: {
      get() {
        return this.open;
      },
      set(value) {
        this.$emit("update:open", value);
      },
    },
    resourcesIds() {
      return this.computedResponse.map((r) => r.data).slice(0, 10);
    },
    resourcesIdsTitle() {
      const count = this.resourcesIds.length;
      return count > 10
        ? "First 10 resources"
        : `Resource${count > 1 ? "s" : ""}`;
    },
    isMultiResponse() {
      return this.response.status === 207;
    },
    computedResponse() {
      return this.isMultiResponse ? this.response.data : [this.response];
    },
    imported() {
      return this.computedResponse.filter(
        (r) => (r.status || r.statusCode) === 201
      ).length;
    },
    warnings() {
      return this.computedResponse.filter(
        (r) => (r.status || r.statusCode) === 409
      ).length;
    },
    errors() {
      return this.computedResponse.filter((r) => {
        const code = r.status || r.statusCode;
        return code !== 409 && code !== 201;
      }).length;
    },
  },
  methods: {
    close() {
      this.computedOpen = false;
    },
  },
};
</script>

<style scoped lang="scss">
.create-result-overlay-container {
  transition: 0.3s;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
  &.open {
    top: 0;
  }
}
.create-result-overlay-btn {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
