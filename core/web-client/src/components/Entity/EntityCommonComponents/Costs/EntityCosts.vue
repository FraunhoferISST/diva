<template>
  <section id="costs">
    <reactive-data-fetcher :id="id" :fetch-method="fetchCosts">
      <v-container fluid v-if="costs">
        <v-row>
          <v-col cols="12">
            <card header="Internal costs">
              <v-container fluid class="px-0 pb-0" slot="body">
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    lg="4"
                    xl="4"
                    v-for="costType in Object.keys(costs.internalCosts)"
                    :key="costType"
                  >
                    <edit-view-content
                      class="fill-height"
                      :initialData="{
                        [costType]: costs.internalCosts[costType],
                      }"
                      @save="(patch) => patchCosts(patch)"
                    >
                      <cost-card
                        slot="view"
                        :title="costs.internalCosts[costType].title"
                        :costs-data="costs.internalCosts[costType]"
                      />
                      <template v-slot:edit="{ update }">
                        <cost-edit
                          :costs-data="costs.internalCosts[costType]"
                          @update:costsData="update({ [costType]: $event })"
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
                        externalCost: costs.externalCost,
                      }"
                      @save="(patch) => patchCosts(patch)"
                    >
                      <cost-card
                        slot="view"
                        :title="costs.externalCost.title"
                        :costs-data="costs.externalCost"
                      />
                      <template v-slot:edit="{ update }">
                        <cost-edit
                          :costs-data="costs.externalCost"
                          @update:costsData="update({ externalCost: $event })"
                        />
                      </template>
                    </edit-view-content>
                  </v-col>
                </v-row>
              </v-container>
            </card>
          </v-col>
        </v-row>
      </v-container>
    </reactive-data-fetcher>
  </section>
</template>

<script>
import Card from "@/components/Base/Card";
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
    Card,
    EditViewContent,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    costs: {
      internalCosts: {
        distributionCost: {
          title: "Distribution cost",
          ...emptyCostData,
        },
        storageCost: { title: "Storage cost", ...emptyCostData },
        maintenanceCost: { title: "Maintenance cost", ...emptyCostData },
      },
      externalCost: { title: "External cost", ...emptyCostData },
    },
  }),
  computed: {
    api() {
      const entityType = this.id.slice(0, this.id.indexOf(":"));
      return this.$api[`${entityType}s`];
    },
  },
  methods: {
    prepareCostsPatch(patch) {
      const currentCosts = { ...this.costs };
      if (patch.externalCost) {
        currentCosts.externalCost = patch.externalCost;
      } else {
        currentCosts.internalCosts = {
          ...currentCosts.internalCosts,
          ...patch,
        };
      }
      let costs = {};
      for (const costsType in currentCosts.internalCosts) {
        if (
          this.isValidPriceValue(currentCosts.internalCosts[costsType].value)
        ) {
          costs.internalCosts = costs.internalCosts ?? {};
          costs.internalCosts[costsType] =
            currentCosts.internalCosts[costsType];
          delete currentCosts.internalCosts[costsType].title;
        }
      }
      if (this.isValidPriceValue(currentCosts.externalCost.value)) {
        costs.externalCost = currentCosts.externalCost;
        delete currentCosts.externalCost.title;
      }
      return costs;
    },

    isValidPriceValue: (price) =>
      price !== undefined && price !== null && price !== "",
    patchCosts(patch) {
      return this.api.patch(this.id, {
        costs: this.prepareCostsPatch(patch),
      });
    },
    fetchCosts() {
      return this.api.getById(this.id, { fields: "costs" }).then(
        ({ data }) =>
          (this.costs = {
            internalCosts: {
              distributionCost: {
                title: "Distribution cost",
                ...(data?.costs?.internalCosts?.distributionCost ??
                  emptyCostData),
              },
              storageCost: {
                title: "Storage cost",
                ...(data?.costs?.internalCosts?.storageCost ?? emptyCostData),
              },
              maintenanceCost: {
                title: "Maintenance cost",
                ...(data?.costs?.internalCosts?.maintenanceCost ??
                  emptyCostData),
              },
            },
            externalCost: {
              title: "External cost",
              ...(data?.costs?.externalCost ?? emptyCostData),
            },
          })
      );
    },
  },
};
</script>
<style lang="scss" scoped></style>
