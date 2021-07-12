<template>
  <section id="dsc">
    <reactive-data-fetcher :id="id" :fetch-method="fetchDscData">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <card header="IDS">
              <template slot="body">
                <v-row dense>
                  <v-col cols="12" class="d-flex">
                    <check-box-card
                      :active="isOffered"
                      title="Available on connector"
                      @change="changeAvailabilityOnDsc"
                    >
                      <p class="ma-0">
                        Make the resource available on the IDS in order to
                        integrate it into an IDS data ecosystem through the
                        <a
                          title="DSC github"
                          target="_blank"
                          href="https://github.com/International-Data-Spaces-Association/DataspaceConnector"
                        >
                          Data Space Connector
                        </a>
                        . Usage policies are an important aspect of IDS, you
                        must set one of the policies listed below.
                      </p>
                    </check-box-card>
                  </v-col>
                </v-row>
                <resource-ids-policies
                  :selected-policy="policy"
                  :is-offered="isOffered"
                  :id="id"
                  @selected="onPolicySelect"
                  @update="onPolicyUpdate"
                />
                <v-row>
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn
                      rounded
                      depressed
                      :color="btnColor"
                      :dark="canApplyChanges"
                      :disabled="!canApplyChanges"
                      :loading="loading"
                      @click="applyOfferChanges"
                    >
                      {{ buttonTitle }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-snackbar
                  v-model="snackbar"
                  :color="snackbarColor"
                  absolute
                  bottom
                  text
                >
                  {{ snackbarText }}
                </v-snackbar>
              </template>
            </card>
          </v-col>
        </v-row>
      </v-container>
    </reactive-data-fetcher>
  </section>
</template>

<script>
import ResourceIdsPolicies from "@/components/Resource/IDS/Policies/ResourceIdsPolicies";
import Card from "@/components/Base/Card";
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
import CheckBoxCard from "@/components/Base/CheckBoxCard";
import { getInitialPolicy } from "@/components/Resource/IDS/Policies/policies";

export default {
  name: "ResourceIDS",
  components: {
    CheckBoxCard,
    ReactiveDataFetcher,
    Card,
    ResourceIdsPolicies,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    snackbar: false,
    snackbarText: "",
    snackbarColor: "#009374",
    btnColor: "#009374",
    loading: false,
    dsc: {},
    isOffered: false,
    policy: {},
    extendedPolicy: {},
    changesMade: false,
  }),
  watch: {
    policy: {
      deep: true,
      handler() {
        this.checkChanges();
      },
    },
    isOffered() {
      this.checkChanges();
    },
  },
  computed: {
    buttonTitle() {
      this.changeBtnColor();
      if (this.changesMade) {
        if (this.hasOffer && !this.isOffered) {
          this.changeBtnColor("error");
          return "Remove from IDS";
        }
        return this.isValidPolicyValue ? "Apply changes" : "Add valid values";
      }
      return "No changes made";
    },
    canApplyChanges() {
      return this.changesMade && this.isValidPolicyValue;
    },
    hasOffer() {
      return !!this.dsc?.offer?.offerId;
    },
    isValidPolicyValue() {
      const value = this.policy[this.extendedPolicy.propTitle];
      const validate = (p) =>
        p !== null &&
        p !== undefined &&
        p !== "" &&
        p !== [] &&
        (this.extendedPolicy?.validation?.(p) ?? true);
      if (value !== null && typeof value === "object") {
        return Object.keys(value).every((key) => {
          return validate(value[key]);
        });
      } else {
        return validate(value);
      }
    },
  },
  methods: {
    checkChanges() {
      const prevValue = JSON.stringify(
        (this.dsc.policy ?? {})[this.extendedPolicy.propTitle]
      );
      const newValue = JSON.stringify(
        this.policy[this.extendedPolicy.propTitle]
      );
      this.changesMade =
        this.hasOffer !== this.isOffered || prevValue !== newValue;
    },
    onPolicySelect(policy) {
      this.extendedPolicy = policy;
      this.policy = { [policy?.propTitle]: policy?.value };
    },
    onPolicyUpdate(policy) {
      this.policy[policy?.propTitle] = policy?.value;
    },
    changeAvailabilityOnDsc(isOffered) {
      this.isOffered = isOffered;
    },
    patchResource() {
      this.$api.resources.patch(this.id, {
        dsc: this.dsc,
      });
    },
    fetchDscData() {
      return this.$api.resources
        .getById(this.id, { fields: "dsc" })
        .then(({ data: { dsc } }) => {
          this.dsc = dsc || {};
          this.isOffered = !!this.dsc.offer?.offerId;
          this.policy = JSON.parse(JSON.stringify(this.dsc.policy ?? {}));
          this.extendedPolicy = getInitialPolicy(this.policy);
        });
    },
    async applyOfferChanges() {
      this.loading = true;
      let promise;
      if (this.isOffered) {
        if (this.hasOffer) {
          promise = this.updateOffer();
        } else {
          promise = this.createOffer();
        }
      } else {
        promise = this.deleteOffer();
      }
      promise
        .then(() => this.showSnackbar("Changes applied"))
        .catch((e) => {
          this.showSnackbar(
            `Some error Occurred! ${e.response?.data?.message || e}`,
            "error"
          );
        })
        .finally(() => (this.loading = false));
    },
    createOffer() {
      return this.$api.dscAdapter.createOffer(this.id, this.policy);
    },
    deleteOffer() {
      return this.$api.dscAdapter.deleteOffer(this.id, this.dsc.offer.offerId);
    },
    updateOffer() {
      return this.$api.dscAdapter.updateOffer(
        this.id,
        this.dsc.offer.offerId,
        this.policy
      );
    },
    changeBtnColor(color = "#009374") {
      this.btnColor = color;
    },
    showSnackbar(msg, color = "#009374") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
};
</script>
