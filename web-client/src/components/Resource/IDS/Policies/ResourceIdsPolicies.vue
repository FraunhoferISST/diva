<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <sub-header text="Select IDS Usage Control Policies" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          v-for="policy in booleanPolicies"
          :key="policy.propTitle"
          class="d-flex"
        >
          <check-box-card
            :active="policy.selected"
            :disabled="!isOffered"
            :title="policy.title"
            @clicked="() => onSelect(policy)"
          >
            <p class="ma-0">{{ policy.description }}</p>
          </check-box-card>
        </v-col>
        <v-col
          cols="6"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="d-flex"
          v-for="policy in inputPolicies"
          :key="policy.propTitle"
        >
          <check-box-card
            :active="policy.selected"
            :disabled="!isOffered"
            :title="policy.title"
            manually
            @clicked="() => onSelect(policy)"
          >
            <v-text-field
              class="ma-0 pt-2 pb-1"
              dense
              :disabled="!policy.selected || !isOffered"
              hide-details
              clearable
              outlined
              required
              rounded
              min="0"
              :rules="[(v) => policy.validation(v)]"
              :type="policy.type"
              v-model.number="policy.value"
            ></v-text-field>
          </check-box-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          sm="12"
          md="6"
          lg="6"
          xl="6"
          v-for="policy in intervalPolicies"
          :key="policy.title"
        >
          <check-box-card
            :active="policy.selected"
            :disabled="!isOffered"
            :title="policy.title"
            manually
            @clicked="() => onSelect(policy)"
          >
            <policy-date-range
              class="pb-5"
              :disabled="!policy.selected || !isOffered"
              :date-range.sync="policy.value"
            />
          </check-box-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import SubHeader from "@/components/Base/SubHeader";
import PolicyDateRange from "@/components/Resource/IDS/Policies/PolicyDateRange";
import CheckBoxCard from "@/components/Base/CheckBoxCard";
import { policies } from "@/components/Resource/IDS/Policies/policies";

export default {
  name: "ResourceIdsPolicies",
  components: {
    CheckBoxCard,
    PolicyDateRange,
    SubHeader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    isOffered: {
      type: Boolean,
      required: true,
    },
    selectedPolicy: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      snackbar: false,
      policies: policies,
      currentSelectedPolicyName: "",
    };
  },
  watch: {
    selectedPolicy() {
      this.setSelectedPolicy();
    },
    policies: {
      deep: true,
      handler() {
        this.$emit("update", this.currentSelectedPolicy);
      },
    },
  },
  computed: {
    currentSelectedPolicy() {
      const index = this.policies.findIndex(
        (p) => p.propTitle in this.selectedPolicy
      );
      return this.policies[index];
    },
    booleanPolicies() {
      return this.policies.filter(({ type }) => type === "boolean");
    },
    intervalPolicies() {
      return this.policies.filter(({ type }) => type === "interval");
    },
    inputPolicies() {
      return this.policies.filter(
        ({ type }) => type === "number" || type === "text" || type === "url"
      );
    },
  },
  methods: {
    onSelect(policy) {
      const index = this.policies.findIndex(
        (p) => p.propTitle === policy.propTitle
      );
      this.$emit("selected", this.policies[index]);
    },
    setSelectedPolicy() {
      this.policies = this.policies.map((p) => ({
        ...p,
        selected: p.propTitle in this.selectedPolicy,
        value: this.selectedPolicy[p.propTitle] ?? p.value,
      }));
    },
  },
};
</script>

<style scoped></style>
