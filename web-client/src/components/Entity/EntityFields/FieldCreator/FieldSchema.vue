<template>
  <v-container fluid class="relative">
    <v-row>
      <v-col cols="12">
        <code-editor :code="schemaCode" language="json" @update="onUpdate" />
      </v-col>
      <v-snackbar v-model="snackbar" :color="color" absolute text bottom>
        {{ message }}
      </v-snackbar>
      <div class="schema-apply-btn">
        <v-scroll-y-reverse-transition>
          <v-btn
            dark
            small
            rounded
            color="#20B2AA"
            v-if="isCodeValid && isCodeSchemaValid"
            @click="applyCodeChanges"
          >
            Apply
            <v-icon right small> done </v-icon>
          </v-btn>
        </v-scroll-y-reverse-transition>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import CodeEditor from "@/components/Editors/CodeEditor";
import { useSnackbar } from "@/composables/snackbar";
import { ref } from "@vue/composition-api";
export default {
  name: "FieldSchema",
  components: { CodeEditor },
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { snackbar, show, message, color } = useSnackbar();
    const editedCode = ref(undefined);
    const dataFromEditedCode = ref(null);
    return {
      editedCode,
      dataFromEditedCode,
      snackbar,
      message,
      color,
      show,
    };
  },
  methods: {
    onUpdate(code) {
      this.editedCode = code;
    },
    applyCodeChanges() {
      this.schemaToEditorData(this.editedCode);
    },
    schemaToEditorData(jsonCode) {
      const parsedJson = JSON.parse(jsonCode);
      const {
        scope = [],
        schema: { properties },
      } = parsedJson;
      const propertyName = Object.keys(properties)[0];
      const {
        schema: {
          properties: {
            [propertyName]: {
              type,
              _ui: { view, position, fullWidth, ...rest },
              ...additional
            },
          },
        },
      } = parsedJson;
      const title = parsedJson.title ?? properties[propertyName].title;
      const description =
        parsedJson.description ?? properties[propertyName].description;
      const convertedData = {
        additional,
        scope,
        definition: {
          propertyName,
          title,
          description,
        },
        type: {
          ...rest,
          uiType: rest.type,
          testValue: rest.fallbackValue,
          type,
        },
        presentation: {
          view,
          position,
          fullWidth,
        },
      };
      this.$emit("jsonToData", convertedData);
      this.editedCode = undefined;
    },
  },
  computed: {
    isCodeSchemaValid() {
      const parsedJson = JSON.parse(this.editedCode);
      const propertyName = Object.keys(parsedJson?.schema?.properties ?? {})[0];
      const property = parsedJson.schema?.properties[propertyName];
      return (
        parsedJson.title &&
        parsedJson.schema &&
        parsedJson.schema.properties &&
        propertyName &&
        property &&
        property.title &&
        property._ui &&
        property._ui.type &&
        property.type
      );
    },
    isCodeValid() {
      try {
        JSON.parse(this.editedCode);
      } catch {
        return false;
      }
      return true;
    },
    schemaCode: {
      get() {
        return JSON.stringify(this.schema, null, 2).trim();
      },
      set(val) {
        this.$emit("update:schema", val);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.schema-apply-btn {
  position: absolute;
  bottom: 30px;
  right: 50px;
}
</style>
