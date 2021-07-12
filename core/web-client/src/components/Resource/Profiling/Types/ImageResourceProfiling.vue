<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <card header="Metadata">
          <v-container fluid class="pa-0" slot="body">
            <meta-data :data="data"></meta-data>
          </v-container>
        </card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <card header="Image OCR">
          <v-container fluid slot="body" class="pa-0">
            <v-row>
              <v-col cols="12" sm="12" md="4" lg="3">
                <img
                  alt="Image preview"
                  style="
                    border-radius: 8px;
                    width: 100%;
                    max-width: 350px;
                    height: auto;
                  "
                  :src="`data:image/jpg;base64,${data.imageThumbnail}`"
                  v-if="data.imageThumbnail"
                />
                <no-data-state v-else />
              </v-col>
              <v-col cols="12" sm="12" md="8" lg="9">
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <v-row dense>
                      <v-col cols="12">
                        <sub-header text="Generated captions" />
                      </v-col>
                      <v-col cols="12">
                        <div v-if="data.imageCaptions">
                          <div
                            class="mb-2"
                            v-for="(item, i) in data.imageCaptions"
                            :key="item.caption + i"
                          >
                            <i>"{{ item.caption }}"</i>
                          </div>
                        </div>
                        <no-data-state v-else />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-row dense>
                      <v-col cols="12">
                        <sub-header text="Auto detected objects" />
                      </v-col>
                      <v-col cols="12">
                        <div v-if="imgObjects.length > 0">
                          <v-chip
                            class="mr-2 mb-2"
                            small
                            v-for="(obj, i) in imgObjects"
                            :key="i"
                          >
                            {{ obj }}
                          </v-chip>
                        </div>
                        <no-data-state v-else />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row dense>
                      <v-col cols="12">
                        <sub-header text="Extracted text" />
                      </v-col>
                      <v-col cols="12">
                        <p class="ma-0" v-if="data.imageOcr">
                          <i>"{{ data.imageOcr }}"</i>
                        </p>
                        <no-data-state v-else />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </card>
      </v-col>
    </v-row>
    <!--    <v-row>
      <v-col cols="12">
        <card header="Estimated personal data privacy">
          <personal-data-evaluation
            slot="body"
            v-if="data.personalData"
            :data="data.personalData"
          />
          <no-data-state v-else slot="body" />
        </card>
      </v-col>
    </v-row>-->
  </v-container>
</template>

<script>
import Card from "@/components/Base/Card";
import NoDataState from "@/components/Base/NoDataState";
// import PersonalDataEvaluation from "@/components/Resource/Profiling/Common/PersonalDataEvaluation";
import MetaData from "@/components/Resource/Profiling/Common/MetaData";
import SubHeader from "@/components/Base/SubHeader";

export default {
  name: "ImageResourceProfiling",
  components: {
    SubHeader,
    MetaData,
    NoDataState,
    Card,
    /*PersonalDataEvaluation,*/
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    profiling: null,
  }),
  computed: {
    imgObjects() {
      if (this.data.imageObjects?.length > 0) {
        return this.data.imageObjects.map(
          ({ label, probability }) =>
            `${label || "N/A"} (${probability.toFixed(2)})`
        );
      }
      return [];
    },
  },
};
</script>

<style scoped lang="scss"></style>
