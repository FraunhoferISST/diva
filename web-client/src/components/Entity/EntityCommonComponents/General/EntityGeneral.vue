<template>
  <section id="general">
    <data-viewer :loading="loading" :updating="updating" :error="error">
      <template v-if="data">
        <v-container class="pa-0 ma-0" fluid v-if="data.id">
          <v-row>
            <v-col
              cols="12"
              :md="attribute.fullWidth ? '12' : '4'"
              v-for="attribute in fields"
              :key="attribute.name"
            >
              <component
                v-if="attribute.component"
                :[attribute.name]="attribute.value"
                :is="attribute.component"
                :id="id"
              />
              <entity-field
                v-else
                :id="id"
                :property="attribute.name"
                :title="attribute.title"
                :type="attribute.type"
                :value.sync="attribute.value"
                :options="attribute.options || []"
                :allowCustom="attribute.allowCustom"
                :multiple="attribute.multiple"
                mutate-source
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </data-viewer>
  </section>
</template>

<script>
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import CustomHeader from "@/components/Base/CustomHeader";
import EntityDataViewer from "@/components/Entity/EntityDataViewer";
import EntityField from "@/components/Entity/EntityFields/EntityField";
import Owners from "@/components/Entity/EntityFields/Owners/Owners";
import Licenses from "@/components/Entity/EntityFields/Licenses/Licenses";
import Location from "@/components/Entity/EntityFields/Location/Location";
import Languages from "@/components/Entity/EntityFields/Languages/Languages";
import { useEntity } from "@/composables/entity";
import { computed } from "@vue/composition-api";
import { useBus } from "@/composables/bus";
import DataViewer from "@/components/DataFetchers/DataViewer";

export default {
  name: "EntityGeneral",
  components: {
    DataViewer,
    Languages,
    Location,
    Licenses,
    Owners,
    EntityField,
    EntityDataViewer,
    CustomHeader,
    InfoBlock,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { on } = useBus();
    on("reload", () => {
      reload();
    });
    const { load, loading, error, data, reload, updating, title } = useEntity(
      props.id,
      {
        reactive: false,
      }
    );
    load();
    return {
      reload,
      load,
      loading,
      updating,
      error,
      data,
      title,
      fields: computed(() =>
        [
          {
            name: "title",
            title: "Title",
            type: "text",
            fallbackValue: "",
            fullWidth: true,
          },
          {
            name: "keywords",
            title: "Keywords",
            type: "select",
            fallbackValue: [],
            allowCustom: true,
            multiple: true,
            fullWidth: true,
          },
          {
            name: "owners",
            title: "Owners",
            fallbackValue: [],
            component: Owners,
          },
          {
            name: "versionInfo",
            title: "Version info",
            fallbackValue: "",
            type: "text",
            fullWidth: false,
          },
          {
            name: "versionNotes",
            title: "Version notes",
            fallbackValue: "",
            type: "text",
            fullWidth: false,
          },
          {
            name: "themes",
            title: "Themes",
            type: "select",
            fallbackValue: "",
            options: [
              "Agriculture",
              "Culture",
              "Economy",
              "Education",
              "Energy",
              "Environment",
              "Finance",
              "Fisheries",
              "Health",
              "Infrastructure",
              "International",
              "Justice",
              "Population",
              "Public Sector",
              "Regional",
              "Science",
              "Society",
              "Sports",
              "Technology",
              "Transport",
            ],
            fullWidth: false,
            multiple: true,
          },
          {
            name: "languages",
            title: "Languages",
            fallbackValue: [],
            component: Languages,
            fullWidth: false,
          },
          {
            name: "plannedAvailability",
            title: "Planned Availability",
            type: "select",
            fallbackValue: "",
            options: ["Temporary", "Experimental", "Available", "Stable"],
            fullWidth: false,
            multiple: false,
          },
          {
            name: "politicalGeocoding",
            title: "Political geocoding",
            type: "select",
            fallbackValue: "",
            options: [
              "International",
              "European",
              "Federal",
              "State",
              "Administrative District",
              "Municipality",
            ],
            fullWidth: false,
            multiple: false,
          },
          {
            name: "dataClassification",
            title: "Data classification",
            type: "select",
            fallbackValue: "",
            options: ["Public", "Internal", "Confidential", "Restricted"],
            fullWidth: false,
            multiple: false,
          },
          {
            name: "description",
            type: "richText",
            fallbackValue: "",
            title: "Description",
            fullWidth: true,
          },
          {
            name: "licenses",
            title: "Licenses",
            component: Licenses,
            fallbackValue: [],
            fullWidth: true,
          },
          {
            name: "location",
            title: "Location",
            component: Location,
            fallbackValue: {},
            fullWidth: true,
          },
        ].map((prop) => ({
          ...prop,
          value: data.value[prop.name] ?? prop.fallbackValue,
        }))
      ),
    };
  },
};
</script>
