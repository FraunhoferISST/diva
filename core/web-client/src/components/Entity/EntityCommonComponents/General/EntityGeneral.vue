<template>
  <section id="general">
    <entity-base-data-fetcher :id="id">
      <template #default="{ data, api }">
        <v-container class="ma-0" fluid>
          <v-row>
            <v-col cols="12">
              <card>
                <template slot="body">
                  <edit-view-content
                    class="mb-5"
                    :initialData="{ title: data.title || '' }"
                    @save="(patch) => api.patch(data.id, patch)"
                  >
                    <general-title
                      slot="view"
                      :title="data.title"
                      :hash="data.uniqueFingerprint || data.id"
                    />
                    <template v-slot:edit="{ update }">
                      <general-title-edit
                        :title="data.title"
                        @update:title="update($event)"
                      />
                    </template>
                  </edit-view-content>

                  <v-row class="mb-2" v-if="data.uniqueFingerprint">
                    <v-col cols="12">
                      <info-block-value>
                        {{ data.uniqueFingerprint }}
                      </info-block-value>
                    </v-col>
                  </v-row>

                  <edit-view-content
                    class="mb-5"
                    :initialData="{ keywords: data.keywords }"
                    @save="(patch) => api.patch(data.id, patch)"
                  >
                    <general-keywords
                      slot="view"
                      :keywords="data.keywords || []"
                    />
                    <template v-slot:edit="{ update }">
                      <general-keywords-edit
                        :keywords="data.keywords || []"
                        @update:keywords="update($event)"
                      />
                    </template>
                  </edit-view-content>

                  <!-- Pass some specific components here -->
                  <slot name="general-optional" :entityType="data.entityType">
                  </slot>

                  <!-- Pass entity specific metadata here, defined in corresponding entity type component -->
                  <slot name="general-meta" :entityType="data.entityType">
                  </slot>

                  <v-row>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Data owner">
                        <edit-view-content
                          slot="value"
                          :initialData="{ ownerId: data.ownerId }"
                          @save="(patch) => api.patch(data.id, patch)"
                        >
                          <general-data-owner
                            slot="view"
                            :owner="data.owner || {}"
                          />
                          <template v-slot:edit="{ update }">
                            <general-data-owner-edit
                              :ownerId="data.ownerId || ''"
                              @update:owner="update($event)"
                            />
                          </template>
                        </edit-view-content>
                      </info-block>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Version info">
                        <edit-view-content
                          slot="value"
                          :initialData="{ versionInfo: data.versionInfo }"
                          @save="(patch) => api.patch(data.id, patch)"
                        >
                          <general-version-info
                            slot="view"
                            :versionInfo="data.versionInfo || ''"
                          />
                          <template v-slot:edit="{ update }">
                            <general-version-info-edit
                              :versionInfo="data.versionInfo || ''"
                              @update:versionInfo="update($event)"
                            />
                          </template>
                        </edit-view-content>
                      </info-block>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Version notes">
                        <edit-view-content
                          slot="value"
                          :initialData="{ versionNotes: data.versionNotes }"
                          @save="(patch) => api.patch(data.id, patch)"
                        >
                          <general-version-notes
                            slot="view"
                            :versionInfo="data.versionNotes || ''"
                          />
                          <template v-slot:edit="{ update }">
                            <general-version-notes-edit
                              :versionNotes="data.versionNotes || ''"
                              @update:versionNotes="update($event)"
                            />
                          </template>
                        </edit-view-content>
                      </info-block>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Rating" :value="data.rating || 'N/A'">
                      </info-block>
                    </v-col>
                  </v-row>
                  <v-row class="mb-2">
                    <v-col
                      cols="12"
                      sm="6"
                      md="3"
                      lg="3"
                      v-if="data.urbanPulseSensorId"
                    >
                      <info-block
                        title="Sensor Id"
                        :value="data.urbanPulseSensorId"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="3"
                      lg="3"
                      v-if="data.urbanPulseSensorSince"
                    >
                      <info-block
                        title="Since date"
                        :value="data.urbanPulseSensorSince"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="3"
                      lg="3"
                      v-if="data.urbanPulseSensorUntil"
                    >
                      <info-block
                        title="Until date"
                        :value="data.urbanPulseSensorUntil"
                      />
                    </v-col>
                  </v-row>
                </template>
              </card>
            </v-col>
            <v-col cols="12">
              <card>
                <template slot="body">
                  <v-row dense>
                    <v-col cols="12">
                      <custom-header text="Description" />
                    </v-col>
                    <v-col cols="12">
                      <edit-view-content
                        slot="body"
                        :initialData="{ description: data.description }"
                        @save="(patch) => api.patch(data.id, patch)"
                      >
                        <general-description
                          slot="view"
                          :description="data.description || ''"
                        />
                        <template v-slot:edit="{ update }">
                          <general-description-edit
                            :description="data.description || ''"
                            @update:description="update($event)"
                          />
                        </template>
                      </edit-view-content>
                    </v-col>
                  </v-row>
                  <v-row dense class="mt-5">
                    <v-col cols="12">
                      <custom-header text="Licenses" />
                    </v-col>
                    <v-col cols="12">
                      <edit-view-content
                        slot="body"
                        :initialData="{ licenses: data.licenses }"
                        @save="(patch) => api.patch(data.id, patch)"
                      >
                        <general-license
                          slot="view"
                          :licenses="data.licenses || []"
                        />
                        <template v-slot:edit="{ update }">
                          <general-license-edit
                            :licenses="data.licenses || []"
                            @update:licenses="update($event)"
                          />
                        </template>
                      </edit-view-content>
                    </v-col>
                  </v-row>
                </template>
              </card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </entity-base-data-fetcher>
  </section>
</template>

<script>
import GeneralTitle from "@/components/Entity/EntityCommonComponents/General/GeneralTitle";
import Card from "@/components/Base/Card";
import GeneralDescription from "@/components/Entity/EntityCommonComponents/General/GeneralDescription";
import GeneralDescriptionEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralDescriptionEdit";
import GeneralVersionInfo from "@/components/Entity/EntityCommonComponents/General/GeneralVersionInfo";
import GeneralVersionInfoEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralVersionInfoEdit";
import EditViewContent from "@/components/Containers/EditViewContent";
import GeneralTitleEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralTitleEdit";
import GeneralKeywordsEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralKeywordsEdit";
import GeneralKeywords from "@/components/Entity/EntityCommonComponents/General/GeneralKeywords";
import GeneralLicense from "@/components/Entity/EntityCommonComponents/General/GeneralLicense/GeneralLicense";
import EntityBaseDataFetcher from "@/components/DataFetchers/EntityBaseDataFetcher";
import GeneralLicenseEdit from "@/components/Entity/EntityCommonComponents/General/GeneralLicense/GeneralLicenseEdit";
import GeneralDataOwner from "@/components/Entity/EntityCommonComponents/General/GeneralDataOwner";
import GeneralDataOwnerEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralDataOwnerEdit";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import GeneralVersionNotesEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralVersionNotesEdit";
import GeneralVersionNotes from "@/components/Entity/EntityCommonComponents/General/GeneralVersionNotes";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import CustomHeader from "@/components/Base/CustomHeader";

export default {
  name: "EntityGeneral",
  components: {
    CustomHeader,
    InfoBlock,
    GeneralVersionNotes,
    GeneralVersionNotesEdit,
    InfoBlockValue,
    GeneralDataOwnerEdit,
    GeneralDataOwner,
    GeneralLicenseEdit,
    EntityBaseDataFetcher,
    GeneralLicense,
    GeneralKeywords,
    GeneralDescription,
    GeneralDescriptionEdit,
    GeneralVersionInfo,
    GeneralVersionInfoEdit,
    Card,
    GeneralTitle,
    GeneralTitleEdit,
    EditViewContent,
    GeneralKeywordsEdit,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    rating() {
      return 0;
    },
  },
};
</script>
