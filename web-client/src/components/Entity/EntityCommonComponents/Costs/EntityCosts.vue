<template>
  <section id="costs">
    <reactive-data-fetcher :id="id" :fetch-method="fetchCosts">
      <v-container fluid v-if="internalCosts || externalCost" class="pa-0">
        <v-row>
          <v-col cols="12">
            <custom-header text="Internal costs" />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="4"
            xl="4"
            v-for="costType in Object.keys(internalCosts)"
            :key="costType"
          >
            <edit-view-content
              class="fill-height"
              :initialData="{
                [costType]: internalCosts[costType],
              }"
              :on-save="(patch) => patchCosts(patch, costType)"
            >
              <cost-card
                slot="view"
                :title="internalCosts[costType].title"
                :costs-data="internalCosts[costType]"
              />
              <template v-slot:edit="{ setEditedData }">
                <cost-edit
                  :costs-data="internalCosts[costType]"
                  @update:costsData="setEditedData({ [costType]: $event })"
                />
              </template>
            </edit-view-content>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <custom-header text="External costs" />
          </v-col>
          <v-col cols="12">
            <edit-view-content
              :initialData="{
                externalCost: externalCost,
              }"
              :on-save="(patch) => patchCosts(patch, 'externalCost')"
            >
              <cost-card
                slot="view"
                :title="externalCost.title"
                :costs-data="externalCost"
              />
              <template v-slot:edit="{ setEditedData }">
                <cost-edit
                  :costs-data="externalCost"
                  @update:costsData="setEditedData({ externalCost: $event })"
                />
              </template>
            </edit-view-content>
          </v-col>
        </v-row>
      </v-container>
    </reactive-data-fetcher>
  </section>
</template>

<script>
import EditViewContent from "@/components/Containers/EditViewContent";
import CostCard from "@/components/Entity/EntityCommonComponents/Costs/CostCard";
import CostEdit from "@/components/Entity/EntityCommonComponents/Costs/CostEdit";
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
import CustomHeader from "@/components/Base/CustomHeader";

const emptyCostData = {
  value: null,
  period: "",
  currency: "",
};

export default {
  name: "EntityCosts",
  components: {
    CustomHeader,
    ReactiveDataFetcher,
    CostEdit,
    CostCard,
    EditViewContent,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    internalCosts: {
      internalMaintenanceCost: {
        title: "Maintenance cost",
        ...emptyCostData,
      },
      internalStorageCost: {
        title: "Storage cost",
        ...emptyCostData,
      },
      internalDistributionCost: {
        title: "Distribution cost",
        ...emptyCostData,
      },
      externalCost: { title: "External cost", ...emptyCostData },
    },
    externalCost: { title: "External cost", ...emptyCostData },
  }),
  computed: {
    api() {
      const entityType = this.id.slice(0, this.id.indexOf(":"));
      return this.$api[`${entityType}s`];
    },
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
      return this.api.patch(this.id, this.prepareCostsPatch(patch, costType));
    },
    fetchCosts() {
      return this.api
        .getById(this.id, {
          fields:
            "internalDistributionCost, internalStorageCost, internalMaintenanceCost, externalCost",
        })
        .then(({ data }) => {
          this.internalCosts = {
            internalDistributionCost: {
              title: "Distribution cost",
              ...(data?.internalDistributionCost ?? emptyCostData),
            },
            internalStorageCost: {
              title: "Storage cost",
              ...(data?.internalStorageCost ?? emptyCostData),
            },
            internalMaintenanceCost: {
              title: "Maintenance cost",
              ...(data?.internalMaintenanceCost ?? emptyCostData),
            },
          };
          this.externalCost = {
            title: "External cost",
            ...(data?.externalCost ?? emptyCostData),
          };
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
