<template>
  <section id="costs">
    <data-viewer :loading="loading" :updating="updating" :error="error">
      <v-container
        fluid
        v-if="costs.internalCosts || costs.externalCost"
        class="pa-0 mt-0"
      >
        <v-row class="pa-0">
          <v-col cols="12">
            <custom-header text="Costs" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            class="d-flex"
            cols="12"
            sm="12"
            md="12"
            lg="4"
            xl="4"
            v-for="costType in Object.keys(costs.internalCosts)"
            :key="costType"
          >
            <field-editor
              class="full-width"
              :data="{
                [costType]: costs.internalCosts[costType],
              }"
              :on-save="(p) => patchCosts(p, costType)"
            >
              <template #view="{ state }">
                <cost-card
                  :title="costs.internalCosts[costType].title"
                  :costs-data="state[costType]"
                />
              </template>
              <template #edit="{ setPatch, patch }">
                <cost-edit
                  :costs-data="patch[costType]"
                  @update:costsData="setPatch({ [costType]: $event })"
                />
              </template>
            </field-editor>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <field-editor
              class="full-width"
              :data="{
                externalCost: costs.externalCost,
              }"
              :on-save="(p) => patchCosts(p, 'externalCost')"
            >
              <template #view="{ state }">
                <cost-card
                  :title="state.externalCost.title"
                  :costs-data="state.externalCost"
                />
              </template>
              <template #edit="{ setPatch, patch }">
                <cost-edit
                  :costs-data="patch.externalCost"
                  @update:costsData="setPatch({ externalCost: $event })"
                />
              </template>
            </field-editor>
          </v-col>
        </v-row>
      </v-container>
    </data-viewer>
  </section>
</template>

<script>
import CostCard from "@/components/Entity/EntityFields/EntityField/Costs/CostCard";
import CostEdit from "@/components/Entity/EntityFields/EntityField/Costs/CostEdit";
import CustomHeader from "@/components/Base/CustomHeader";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useEntity } from "@/composables/entity";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
import { onMounted, ref } from "@vue/composition-api";
import { useBus } from "@/composables/bus";

const emptyCostData = {
  value: null,
  period: "",
  currency: "",
};

export default {
  name: "EntityCosts",
  components: {
    FieldEditor,
    DataViewer,
    CustomHeader,
    CostEdit,
    CostCard,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { on } = useBus();
    onMounted(() => on("reload", () => reload().then(setLoadedCosts)));
    const costs = ref({
      internalCosts: {
        internalMaintenanceCost: {
          title: "Internal maintenance cost",
          ...emptyCostData,
        },
        internalStorageCost: {
          title: "Internal storage cost",
          ...emptyCostData,
        },
        internalDistributionCost: {
          title: "Internal distribution cost",
          ...emptyCostData,
        },
        externalCost: { title: "External cost", ...emptyCostData },
      },
      externalCost: { title: "External cost", ...emptyCostData },
    });
    const { data, patch, load, reload, updating, loading, error, patchError } =
      useEntity(props.id, {
        reactive: false,
      });
    const setLoadedCosts = () => {
      costs.value.internalCosts = {
        internalDistributionCost: {
          title: "Internal distribution cost",
          ...(data.value?.internalDistributionCost ?? emptyCostData),
        },
        internalStorageCost: {
          title: "Internal storage cost",
          ...(data.value?.internalStorageCost ?? emptyCostData),
        },
        internalMaintenanceCost: {
          title: "Internal maintenance cost",
          ...(data.value?.internalMaintenanceCost ?? emptyCostData),
        },
      };
      costs.value.externalCost = {
        title: "External cost",
        ...(data.value?.externalCost ?? emptyCostData),
      };
    };
    load({
      fields:
        "internalDistributionCost, internalStorageCost, internalMaintenanceCost, externalCost",
    }).then(setLoadedCosts);

    return {
      costs,
      patch,
      loading,
      error,
      updating,
      patchError,
    };
  },
  methods: {
    prepareCostsPatch(patch, costType) {
      if (this.isValidPriceValue(patch[costType].value)) {
        return patch;
      }
      return { [costType]: null };
    },

    isValidPriceValue: (price) => {
      return (
        !Number.isNaN(price) &&
        price !== undefined &&
        price !== null &&
        price !== ""
      );
    },

    patchCosts(patch, costType) {
      return this.patch(this.prepareCostsPatch(patch, costType)).then(() => {
        if (this.patchError) {
          throw this.patchError;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.maxWidth {
  width: 100%;
}
</style>
