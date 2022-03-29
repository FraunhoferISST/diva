<template>
  <info-block title="Languages">
    <template #value>
      <field-editor :data="{ languages }" :on-save="updateLanguages">
        <template #view="{ state }">
          <no-data-state v-if="!hasLanguages" text="Select languages">
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
import { useEntity } from "@/composables/entity";
import LanguagesEdit from "@/components/Entity/EntityFields/Languages/LanguagesEdit";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";

export default {
  name: "Languages",
  inheritAttrs: false,
  components: { FieldEditor, LanguagesEdit, InfoBlock, NoDataState },
  props: {
    id: {
      type: String,
      required: true,
    },
    languages: {
      type: Array,
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
  computed: {
    hasLanguages() {
      return this.languages.length > 0;
    },
  },
  methods: {
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
