<template>
  <section id="general">
    <entity-base-data-fetcher :id="id">
      <template #default="{ data, api }">
        <v-container class="ma-0" fluid v-if="data.id">
          <v-row>
            <v-col cols="12">
              <card>
                <template slot="body">
                  <edit-view-content
                    class="mb-5"
                    :initialData="{ title: data.title || '' }"
                    :on-save="(patch) => api.patch(data.id, patch)"
                    @saved="({ title }) => (data.title = title)"
                  >
                    <template #view>
                      <general-title
                        :title="data.title"
                        :hash="data.uniqueFingerprint || data.id"
                      />
                    </template>
                    <template #edit="{ setEditedData }">
                      <general-title-edit
                        :title="data.title"
                        @update:title="setEditedData($event)"
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
                    :on-save="(patch) => api.patch(data.id, patch)"
                    @saved="({ keywords }) => (data.keywords = keywords)"
                  >
                    <general-keywords
                      slot="view"
                      :keywords="data.keywords || []"
                    />
                    <template v-slot:edit="{ setEditedData }">
                      <general-keywords-edit
                        :keywords="data.keywords"
                        @update:keywords="setEditedData($event)"
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
                          :on-save="(patch) => api.patch(data.id, patch)"
                          @saved="({ ownerId }) => (data.ownerId = ownerId)"
                        >
                          <general-data-owner
                            slot="view"
                            :owner="data.owner || {}"
                            :owner-id="data.ownerId || ''"
                          />
                          <template v-slot:edit="{ setEditedData }">
                            <general-data-owner-edit
                              :ownerId="data.ownerId || ''"
                              :owner="data.owner"
                              @update:owner="setEditedData($event)"
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
                          :on-save="(patch) => api.patch(data.id, patch)"
                          @saved="
                            ({ versionInfo }) =>
                              (data.versionInfo = versionInfo)
                          "
                        >
                          <general-version-info
                            slot="view"
                            :versionInfo="data.versionInfo || ''"
                          />
                          <template v-slot:edit="{ setEditedData }">
                            <general-version-info-edit
                              :versionInfo="data.versionInfo || ''"
                              @update:versionInfo="setEditedData($event)"
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
                          :on-save="(patch) => api.patch(data.id, patch)"
                          @saved="
                            ({ versionNotes }) =>
                              (data.versionNotes = versionNotes)
                          "
                        >
                          <general-version-notes
                            slot="view"
                            :versionInfo="data.versionNotes || ''"
                          />
                          <template #edit="{ setEditedData }">
                            <general-version-notes-edit
                              :versionNotes="data.versionNotes || ''"
                              @update:versionNotes="setEditedData($event)"
                            />
                          </template>
                        </edit-view-content>
                      </info-block>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Rating" :value="data.rating || 'N/A'">
                      </info-block>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Planned availability level">
                        <edit-view-content
                          slot="value"
                          :initialData="{
                            plannedAvailability: data.plannedAvailability,
                          }"
                          :on-save="(patch) => api.patch(data.id, patch)"
                          @saved="
                            ({ plannedAvailability }) =>
                              (data.plannedAvailability = plannedAvailability)
                          "
                        >
                          <general-planned-availability
                            slot="view"
                            :planned-availability="
                              data.plannedAvailability || ''
                            "
                          />
                          <template #edit="{ setEditedData, state }">
                            <general-planned-availability-edit
                              :planned-availability="
                                state.plannedAvailability || ''
                              "
                              @update:plannedAvailability="
                                setEditedData($event)
                              "
                            />
                          </template>
                        </edit-view-content>
                      </info-block>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="3">
                      <info-block title="Political geocoding">
                        <edit-view-content
                          slot="value"
                          :initialData="{
                            politicalGeocoding: data.politicalGeocoding,
                          }"
                          :on-save="(patch) => api.patch(data.id, patch)"
                          @saved="
                            ({ politicalGeocoding }) =>
                              (data.politicalGeocoding = politicalGeocoding)
                          "
                        >
                          <general-political-geocoding
                            slot="view"
                            :political-geocoding="data.politicalGeocoding || []"
                          />
                          <template #edit="{ setEditedData, state }">
                            <general-political-geocoding-edit
                              :political-geocoding="
                                state.politicalGeocoding || []
                              "
                              @update:politicalGeocoding="setEditedData($event)"
                            />
                          </template>
                        </edit-view-content>
                      </info-block>
                    </v-col>
                  </v-row>
                  <v-row class="mb-2" v-if="data.urbanPulseSensorId">
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
                      <custom-header text="Themes" />
                    </v-col>
                    <v-col cols="12">
                      <edit-view-content
                        slot="body"
                        :initialData="{ themes: data.themes }"
                        :on-save="(patch) => api.patch(data.id, patch)"
                        @saved="({ themes }) => (data.themes = themes)"
                      >
                        <general-themes
                          slot="view"
                          :themes="data.themes || []"
                        />
                        <template v-slot:edit="{ setEditedData, state }">
                          <general-themes-edit
                            :themes="state.themes || []"
                            @update:themes="setEditedData($event)"
                          />
                        </template>
                      </edit-view-content>
                    </v-col>
                  </v-row>
                  <v-row dense class="mt-5">
                    <v-col cols="12">
                      <custom-header text="Description" />
                    </v-col>
                    <v-col cols="12">
                      <edit-view-content
                        slot="body"
                        :initialData="{ description: data.description }"
                        :on-save="(patch) => api.patch(data.id, patch)"
                        @saved="
                          ({ description }) => (data.description = description)
                        "
                      >
                        <general-description
                          slot="view"
                          :description="data.description || ''"
                        />
                        <template v-slot:edit="{ setEditedData }">
                          <general-description-edit
                            :description="data.description || ''"
                            @update:description="setEditedData($event)"
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
                        :on-save="(patch) => api.patch(data.id, patch)"
                        @saved="({ licenses }) => (data.licenses = licenses)"
                      >
                        <general-license
                          slot="view"
                          :licenses="data.licenses || []"
                        />
                        <template v-slot:edit="{ setEditedData }">
                          <general-license-edit
                            :licenses="data.licenses || []"
                            @update:licenses="setEditedData($event)"
                          />
                        </template>
                      </edit-view-content>
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
                      <custom-header text="Location" />
                    </v-col>
                    <v-col cols="12">
                      <edit-view-content
                        :clickable-content="!!!data.location"
                        slot="body"
                        :initialData="{ location: data.location }"
                        :on-save="(patch) => api.patch(data.id, patch)"
                        @saved="({ location }) => (data.location = location)"
                      >
                        <general-location
                          slot="view"
                          :location="data.location || {}"
                        />
                        <template #edit="{ setEditedData }">
                          <general-location-edit
                            :location="data.location || {}"
                            @update:location="setEditedData($event)"
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
import GeneralLocation from "@/components/Entity/EntityCommonComponents/General/GeneralLocation";
import GeneralLocationEdit from "@/components/Entity/EntityCommonComponents/General/GeneralEditComponents/GeneralLocationEdit";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import CustomHeader from "@/components/Base/CustomHeader";
import GeneralThemes from "@/components/Entity/EntityCommonComponents/General/GeneralThemes/GeneralThemes";
import GeneralThemesEdit from "@/components/Entity/EntityCommonComponents/General/GeneralThemes/GeneralThemesEdit";
import GeneralPoliticalGeocoding from "@/components/Entity/EntityCommonComponents/General/GeneralPoliticalGeocoding/GeneralPoliticalGeocoding";
import GeneralPoliticalGeocodingEdit from "@/components/Entity/EntityCommonComponents/General/GeneralPoliticalGeocoding/GeneralPoliticalGeocodingEdit";
import GeneralPlannedAvailability from "@/components/Entity/EntityCommonComponents/General/GeneralPlannedAvailability/GeneralPlannedAvailability";
import GeneralPlannedAvailabilityEdit from "@/components/Entity/EntityCommonComponents/General/GeneralPlannedAvailability/GeneralPlannedAvailabilityEdit";

export default {
  name: "EntityGeneral",
  components: {
    GeneralPlannedAvailabilityEdit,
    GeneralPlannedAvailability,
    GeneralPoliticalGeocodingEdit,
    GeneralPoliticalGeocoding,
    GeneralThemesEdit,
    GeneralThemes,
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
    GeneralLocation,
    GeneralLocationEdit,
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
