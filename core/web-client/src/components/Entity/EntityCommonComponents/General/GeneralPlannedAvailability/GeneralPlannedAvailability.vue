<template>
  <no-data-state v-if="!plannedAvailability" text="You can provide themes here">
  </no-data-state>
  <info-block-value v-else>
    <v-chip class="ml-1 mt-1" small label>
      {{ plannedAvailability }}
    </v-chip>
  </info-block-value>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
export default {
  name: "GeneralPlannedAvailability",
  components: { InfoBlockValue, NoDataState },
  props: {
    plannedAvailability: {
      type: String,
      required: true,
    },
  },
};
</script>
