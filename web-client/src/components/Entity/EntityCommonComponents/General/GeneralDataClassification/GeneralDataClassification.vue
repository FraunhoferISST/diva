<template>
  <no-data-state v-if="!hasDataClassification" text="Set data classification">
  </no-data-state>
  <div v-else>
    <v-chip small label>
      {{ dataClassification }}
    </v-chip>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "GeneralDataClassification",
  components: { NoDataState },
  props: {
    dataClassification: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasDataClassification() {
      return this.dataClassification;
    },
  },
};
</script>
