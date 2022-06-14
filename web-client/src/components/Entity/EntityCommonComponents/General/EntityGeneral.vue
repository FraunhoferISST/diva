<template>
  <section id="general">
    <data-viewer :loading="loading" :updating="updating" :error="error">
      <template v-if="data">
        <v-container class="pa-0 ma-0" fluid v-if="data.id">
          <v-row>
            <v-col
              cols="12"
              :md="field._ui.fullWidth ? '12' : '4'"
              v-for="field in fields"
              :key="field.propertyName"
            >
              <component
                v-if="field._ui.component"
                :[field.propertyName]="field.value"
                :is="field._ui.component"
                :id="id"
                :editable="!!field.isPatchable"
                :field-schema="field"
              />
              <entity-field
                v-else
                :id="id"
                :field-schema="field"
                :value.sync="field.value"
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
import EntityField from "@/components/Entity/EntityFields/EntityField/EntityField";
import Owners from "@/components/Entity/EntityFields/EntityField/Owners/Owners";
import Licenses from "@/components/Entity/EntityFields/EntityField/Licenses/Licenses";
import Location from "@/components/Entity/EntityFields/EntityField/Location/Location";
import Languages from "@/components/Entity/EntityFields/EntityField/Languages/Languages";
import SingleRelation from "@/components/Entity/EntityFields/EntityField/SingleRelation/SingleRelation";
import MultiRelation from "@/components/Entity/EntityFields/EntityField/MultiRelation/MultiRelation";
import DestroyclaimRefersTo from "@/components/Entity/EntityFields/EntityField/Destroyclaims/DestroyclaimRefersTo";
import DestroyclaimReasons from "@/components/Entity/EntityFields/EntityField/Destroyclaims/DestroyclaimReasons";
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
    SingleRelation,
    MultiRelation,
    DestroyclaimRefersTo,
    DestroyclaimReasons,
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
    const { load, loading, error, data, reload, updating, schema } = useEntity(
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
      schema,
      fields: computed(() =>
        Object.entries(schema.value ?? {})
          .map(([_, v]) => ({ ...v }))
          .filter(
            (schemaEntity) =>
              schemaEntity.schema.properties[schemaEntity.propertyName]?._ui
                ?.view === "overview"
          )
          .map((schemaEntity) => ({
            ...schemaEntity,
            _ui: schemaEntity.schema.properties[schemaEntity.propertyName]._ui,
          }))
          .map((schemaEntity) => ({
            ...schemaEntity,
            isPatchable:
              schemaEntity.isPatchable &&
              !data.value.isArchived &&
              data.value.isEditable,
            value:
              data.value[schemaEntity.propertyName] ??
              schemaEntity.schema.default ??
              schemaEntity.schema?.items?.default ??
              schemaEntity._ui.fallbackValue,
          }))
          .sort((a, b) => a._ui.position - b._ui.position)
      ),
    };
  },
};
</script>
