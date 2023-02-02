<template>
  <info-block :title="fieldSchema.title">
    <template #title v-if="fieldSchema.description">
      <info-block-title class="d-flex justify-space-between">
        {{ fieldSchema.title }}
        <template #info>
          <v-tooltip top open-delay="600" max-width="400px">
            <template #activator="{ on, attrs }">
              <v-icon color="primary" dense v-bind="attrs" v-on="on">
                info_outline
              </v-icon>
            </template>
            <span>{{ fieldSchema.description }}</span>
          </v-tooltip>
        </template>
      </info-block-title>
    </template>
    <template #value>
      <field-editor
        :data="{ languages }"
        :on-save="updateLanguages"
        :editable="editable"
      >
        <template #view="{ state }">
          <no-data-state v-if="!hasLanguages(state)" text="Select languages">
          </no-data-state>
          <div v-else>
            <v-chip
              class="ml-1 mt-1"
              small
              label
              v-for="(language, i) in state.languages"
              :key="language + '_' + i"
            >
              {{ language.language }} ({{ language.alpha2.toUpperCase() }})
            </v-chip>
          </div>
        </template>
        <template #edit="{ setPatch, patch }">
          <languages-edit
            :languages="patch.languages"
            @update:languages="(input) => setPatch({ languages: input })"
          />
        </template>
      </field-editor>
    </template>
  </info-block>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import { useEntity } from "@/composables/entity";
import LanguagesEdit from "@/components/Entity/EntityFields/EntityField/Languages/LanguagesEdit";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";

export default {
  name: "Languages",
  inheritAttrs: false,
  components: {
    FieldEditor,
    LanguagesEdit,
    InfoBlock,
    InfoBlockTitle,
    NoDataState,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    languages: {
      type: Array,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    fieldSchema: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { patch, error } = useEntity(props.id);
    return {
      patch,
      error,
    };
  },
  methods: {
    hasLanguages(state) {
      return (state.languages ?? []).length > 0;
    },
    updateLanguages(patch) {
      return this.patch(patch).then(() => {
        if (this.error) {
          throw this.error;
        }
      });
    },
  },
};
</script>
