<template>
  <div class="cost-edit-container d-flex align-center">
    <v-col cols="12">
      <edit-activate-transition>
        <v-row dense>
          <v-col cols="12" sm="8">
            <v-text-field
              color="info"
              hide-details
              v-model="data.value"
              outlined
              class="resource-desc-edit"
              autofocus
              type="number"
              min="0"
              placeholder="Amount"
              clearable
              dense
              required
              :rules="[(value) => !!value]"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              color="info"
              clearable
              hide-details
              outlined
              :items="currencies"
              v-model="data.currency"
              label="Currency"
              dense
              validate-on-blur
              required
              :rules="[(value) => !!value]"
            ></v-select>
          </v-col>
          <v-col class="pt-2" cols="12">
            <cost-period-edit :period.sync="data.period" />
          </v-col>
        </v-row>
      </edit-activate-transition>
    </v-col>
  </div>
</template>

<script>
import EditActivateTransition from "@/components/Transitions/EditActivateTransition";
import CostPeriodEdit from "@/components/Entity/EntityCommonComponents/Costs/CostPeriodEdit";

export default {
  name: "CostEdit",
  components: { EditActivateTransition, CostPeriodEdit },
  props: {
    costsData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currencies: ["$", "€"],
      data: { ...this.costsData },
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.$emit("update:costsData", {
          value: parseFloat(this.data.value),
          period: this.data.period ?? "",
          currency: this.data.currency,
        });
      },
    },
  },
};
</script>

<style scoped lang="scss">
.cost-edit-container {
  min-height: 125px;
}
</style>
