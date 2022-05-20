<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <card class="pt-lg-16 px-lg-16">
          <template #body>
            <v-row>
              <v-col cols="12">
                <h4 class="title">Entities</h4>
                <v-stepper v-model="e6" vertical>
                  <v-stepper-step :complete="e6 > 1" step="1">
                    Select an app
                    <small>Summarize if needed</small>
                  </v-stepper-step>

                  <v-stepper-content step="1">
                    <v-card
                      color="grey lighten-1"
                      class="mb-12"
                      height="200px"
                    ></v-card>
                    <v-btn color="primary" @click="e6 = 2"> Continue </v-btn>
                    <v-btn text> Cancel </v-btn>
                  </v-stepper-content>

                  <v-stepper-step :complete="e6 > 2" step="2">
                    Configure analytics for this app
                  </v-stepper-step>

                  <v-stepper-content step="2">
                    <v-card
                      color="grey lighten-1"
                      class="mb-12"
                      height="200px"
                    ></v-card>
                    <v-btn color="primary" @click="e6 = 3"> Continue </v-btn>
                    <v-btn text> Cancel </v-btn>
                  </v-stepper-content>

                  <v-stepper-step :complete="e6 > 3" step="3">
                    Select an ad format and name ad unit
                  </v-stepper-step>

                  <v-stepper-content step="3">
                    <v-card
                      color="grey lighten-1"
                      class="mb-12"
                      height="200px"
                    ></v-card>
                    <v-btn color="primary" @click="e6 = 4"> Continue </v-btn>
                    <v-btn text> Cancel </v-btn>
                  </v-stepper-content>

                  <v-stepper-step step="4">
                    View setup instructions
                  </v-stepper-step>
                  <v-stepper-content step="4">
                    <v-card
                      color="grey lighten-1"
                      class="mb-12"
                      height="200px"
                    ></v-card>
                    <v-btn color="primary" @click="e6 = 1"> Continue </v-btn>
                    <v-btn text> Cancel </v-btn>
                  </v-stepper-content>
                </v-stepper>
              </v-col>
            </v-row>
          </template>
        </card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Card from "@/components/Base/Card";

export default {
  name: "DestroyPhaseOverview",
  components: {
    Card,
  },
};
</script>

<style scoped lang="scss">
.dashboard-count {
  font-size: 4rem;
  font-weight: bolder;
  font-family: $font_header;
  color: $font_primary_color;
}

.title {
  font-family: $font_body;
  letter-spacing: 0.07rem;
  display: block;
  font-size: 1.3rem;
  text-transform: capitalize;
  opacity: 0.9;
}
</style>
