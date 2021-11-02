<template>
  <v-row>
    <v-col cols="12">
      <custom-header :text="title" />
    </v-col>
    <v-col cols="12" class="pb-5">
      <v-text-field
        rounded
        v-model="computedCredentials.baseUrl"
        type="url"
        validate-on-blur
        label="Base URL"
        placeholder="https://my.source.com"
        required
        outlined
        hide-details
        light
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="6" md="6" class="pb-5">
      <v-text-field
        rounded
        v-model="computedCredentials.username"
        type="text"
        label="User name"
        required
        outlined
        hide-details
        light
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="6" sm="6" md="6" class="pb-5">
      <v-text-field
        rounded
        v-model="computedCredentials.password"
        type="password"
        label="Password"
        required
        outlined
        hide-details
        light
        dense
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";

export default {
  name: "SourceCredentials",
  components: { CustomHeader },
  props: {
    credentials: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: "Add credentials to connect with your source",
    },
  },
  computed: {
    computedCredentials: {
      get() {
        return this.credentials;
      },
      set(value) {
        this.$emit("update:credentials", value);
      },
    },
  },
};
</script>

<style scoped></style>
