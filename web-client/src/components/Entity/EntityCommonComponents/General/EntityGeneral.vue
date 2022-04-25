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
              :key="attribute.propertyName"
            >
              <component
                v-if="attribute.component"
                :[attribute.propertyName]="attribute.value"
                :is="attribute.component"
                :id="id"
              />
              <entity-field
                v-else
                :id="id"
                :property="attribute.propertyName"
                :title="attribute.title"
                :type="attribute.type"
                :value.sync="attribute.value"
                :options="attribute.options || attribute.enum || []"
                :allowCustom="attribute.allowCustom"
                :multiple="attribute.multiple"
                :min-length="attribute.minLength"
                :max-length="attribute.maxLength"
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
          .map(([k, v]) => ({ ...v, propertyName: k }))
          .filter((prop) => prop._ui && prop._ui.view === "overview")
          .map((prop) => ({
            ...prop,
            ...prop._ui,
            value:
              data.value[prop.propertyName] ??
              prop.default ??
              prop._ui.fallbackValue,
          }))
          .sort((a, b) => a.position - b.position)
      ),
    };
  },
};
</script>
