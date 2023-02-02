<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" class="mb-0">
        <v-autocomplete
          v-model="computedDestroyReason.name"
          :items="destroyReasonsList"
          item-text="name"
          item-value="name"
          hide-no-data
          dense
          outlined
          @input="($event) => onSelect($event, 'name')"
          label="Destroy Reason"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="computedDestroyReason.value"
          v-show="computedDestroyReason.name === 'Custom Reason'"
          hide-details="auto"
          label="Custom Reason"
          placeholder="Specify a custom Destroy Reason"
          clearable
          outlined
          hide-no-data
          type="text"
          required
          :rules="[
            (value) => !!value || 'required',
            (value) => value.length > 1 || 'minimum of 2 characters required',
          ]"
          @input="($event) => onSelect($event, 'value')"
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <slot>
          <v-btn rounded small text color="error" @click="emitRemove">
            Remove Destroy Reason
          </v-btn>
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DestroyReasonsEdit",
  inheritAttrs: false,
  components: {},
  props: {
    destroyReason: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: this.destroyReason.name,
      destroyReasonsList: [
        {
          value: "std:reason:data-quality:accessibility:accessibility",
          name: "Data Quality - Accessibility",
        },
        {
          value: "std:reason:data-quality:accessibility:access-security",
          name: "Data Quality - Access Security",
        },
        {
          value:
            "std:reason:data-quality:representational:concise-representation",
          name: "Data Quality - Concise Representation",
        },
        {
          value:
            "std:reason:data-quality:representational:representational-consistency",
          name: "Data Quality - Representational Consistency",
        },
        {
          value:
            "std:reason:data-quality:representational:ease-of-understanding",
          name: "Data Quality - Ease of Understanding",
        },
        {
          value: "std:reason:data-quality:representational:interpretability",
          name: "Data Quality - Interpretability",
        },

        {
          value:
            "std:reason:data-quality:contextual:appropriate-amount-of-data",
          name: "Data Quality - Appropriate Amount of Data",
        },
        {
          value: "std:reason:data-quality:contextual:completeness",
          name: "Data Quality - Completeness",
        },
        {
          value: "std:reason:data-quality:contextual:timeliness",
          name: "Data Quality - Timeliness",
        },
        {
          value: "std:reason:data-quality:contextual:relevancy",
          name: "Data Quality - Relevancy",
        },
        {
          value: "std:reason:data-quality:contextual:value-added",
          name: "Data Quality - Value-added",
        },

        {
          value: "std:reason:data-quality:intrinsic:reputation",
          name: "Data Quality - Reputation",
        },
        {
          value: "std:reason:data-quality:intrinsic:believability",
          name: "Data Quality - Believability",
        },
        {
          value: "std:reason:data-quality:intrinsic:objectivity",
          name: "Data Quality - Objectivity",
        },
        {
          value: "std:reason:data-quality:intrinsic:accuracy",
          name: "Data Quality - Accuracy",
        },
        {
          value: "std:reason:organizational:principles:green-it",
          name: "Organizational - Principles - Green IT",
        },
        {
          value: "std:reason:organizational:principles:ethics",
          name: "Organizational - Principles - Ethics",
        },
        {
          value: "std:reason:organizational:principles:moral",
          name: "Organizational - Principles - Moral",
        },
        {
          value: "std:reason:organizational:principles:fairness",
          name: "Organizational - Principles - Fairness",
        },
        {
          value: "std:reason:organizational:economics:irrelevance",
          name: "Organizational - Economics - Irrelevance",
        },
        {
          value: "std:reason:organizational:economics:lack-of-value",
          name: "Organizational - Economics - Lack of Value",
        },
        {
          value: "std:reason:organizational:economics:save-costs",
          name: "Organizational - Economics - Save Costs",
        },
        {
          value: "std:reason:organizational:economics:save-time",
          name: "Organizational - Economics - Save Time",
        },
        {
          value: "std:reason:technical:environment-focused:free-storage-space",
          name: "Technical - Environment-focused - Free Storage Space",
        },
        {
          value: "std:reason:technical:environment-focused:improve-efficacy",
          name: "Technical - Environment-focused - Improve Efficacy",
        },
        {
          value: "std:reason:technical:environment-focused:improve-efficiency",
          name: "Technical - Environment-focused - Improve Efficiency",
        },
        {
          value: "std:reason:technical:data-focused:corrupted",
          name: "Technical - Data-focused - Corrupted",
        },
        {
          value: "std:reason:technical:data-focused:representation",
          name: "Technical - Data-focused - Representation",
        },
        {
          value: "std:reason:technical:data-focused:invalid-data",
          name: "Technical - Data-focused - Invalid Data",
        },
        {
          value:
            "std:reason:compliance:laws-contracts:crime-illegal:betrayal-of-secrets",
          name: "Compliance - Laws/Contracts - Crime/Illegal - Betrayal of Secrets",
        },
        {
          value: "std:reason:compliance:laws-contracts:crime-illegal:copyright",
          name: "Compliance - Laws/Contracts - Crime/Illegal - Copyright",
        },
        {
          value: "std:reason:compliance:laws-contracts:data-protection:ccpa",
          name: "Compliance - Laws/Contracts - Data Protection - CCPA",
        },
        {
          value: "std:reason:compliance:laws-contracts:data-protection:dsgvo",
          name: "Compliance - Laws/Contracts - Data Protection - DSGVO",
        },
        {
          value: "std:reason:compliance:laws-contracts:data-protection:gdpr",
          name: "Compliance - Laws/Contracts - Data Protection - GDPR",
        },
        {
          value: "std:reason:compliance:laws-contracts:nda",
          name: "Compliance - Laws/Contracts - NDA",
        },
        {
          value:
            "std:reason:compliance:laws-contracts:expired-retention-period",
          name: "Compliance - Laws/Contracts - Expired Retention Period",
        },
        {
          value: "std:reason:compliance:laws-contracts:sla",
          name: "Compliance - Laws/Contracts - SLA",
        },
        {
          value: "std:reason:compliance:standards:external:nist",
          name: "Compliance - Standards - External - NIST",
        },
        {
          value: "std:reason:compliance:standards:external:iso",
          name: "Compliance - Standards - External - ISO",
        },
        {
          value: "std:reason:compliance:standards:external:din",
          name: "Compliance - Standards - External - DIN",
        },
        {
          value: "std:reason:compliance:standards:internal:employee-guides",
          name: "Compliance - Standards - Internal - Employee Guides",
        },
        {
          value:
            "std:reason:security:integrity-reliability:malicious-executable-data",
          name: "Security - Integrity/Reliability - Malicious Executable Data",
        },
        {
          value: "std:reason:security:integrity-reliability:malicious-data",
          name: "Security - Integrity/Reliability - Malicious Data",
        },
        {
          value: "std:reason:security:integrity-reliability:unintended-changes",
          name: "Security - Integrity/Reliability - Unintended Changes",
        },
        {
          value:
            "std:reason:security:integrity-reliability:social-engineering:scareware",
          name: "Security - Integrity/Reliability - Social Engineering - Scareware",
        },
        {
          value:
            "std:reason:security:integrity-reliability:social-engineering:spam",
          name: "Security - Integrity/Reliability - Social Engineering - Spam",
        },
        {
          value:
            "std:reason:security:integrity-reliability:social-engineering:phishing",
          name: "Security - Integrity/Reliability - Social Engineering - Phishing",
        },
        {
          value: "std:reason:security:confidentiality:change-of-scope",
          name: "Security - Confidentiality - Change of Scope",
        },
        {
          value: "std:reason:security:confidentiality:clear-traces",
          name: "Security - Confidentiality - Clear Traces",
        },
        {
          value: "std:reason:security:confidentiality:storage-location",
          name: "Security - Confidentiality - Storage Location",
        },
        {
          value: "std:reason:security:confidentiality:missing-encryption",
          name: "Security - Confidentiality - Missing Encryption",
        },
        {
          value: "std:reason:security:confidentiality:discard-sell-hardware",
          name: "Security - Confidentiality - Discard/Sell Hardware",
        },
        {
          value: "",
          name: "Custom Reason",
        },
      ],
    };
  },
  computed: {
    computedDestroyReason: {
      get() {
        return this.destroyReason;
      },
      set(val) {
        this.$emit("update:destroyReason", val);
      },
    },
  },
  methods: {
    truncateText(text) {
      return text.length > 50 ? `${text.slice(0, 50)}...` : text;
    },
    onSelect(val, prop) {
      this.onEdit(val, prop);
    },
    onEdit(val, prop) {
      if (prop === "name") {
        this.computedDestroyReason = {
          name: val,
          value: this.destroyReasonsList.find((e) => e.name === val).value,
        };
      }
      if (prop === "value") {
        this.computedDestroyReason = {
          name: this.computedDestroyReason.name,
          value: val,
        };
      }
    },
    emitRemove() {
      this.$emit("remove");
    },
  },
};
</script>
<style scoped></style>
