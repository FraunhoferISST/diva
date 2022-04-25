<template>
  <check-box-card-group :items="typesOptions" :selected.sync="computedType">
    <template #default="{ toggle, selectedIndices }">
      <v-container fluid class="pa-0">
        <v-row dense>
          <v-col
            cols="12"
            :sm="type.value.uiType === 'select' ? '12' : '4'"
            v-for="(type, i) in typesOptions"
            :key="i"
          >
            <check-box-card-item
              :active="selectedIndices.includes(i)"
              :title="type.title"
              @clicked="() => toggle(i)"
            >
              <div>
                {{ type.description }}
              </div>
              <div v-if="type.value.uiType === 'select'">
                <v-container fluid class="px-0">
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea
                        v-model="type.value.options"
                        label="Options list separated by coma"
                        placeholder="Option one, Option two, another option, ..."
                        outlined
                        dense
                        hide-details
                        :disabled="!selectedIndices.includes(i)"
                        background-color="white"
                        rows="3"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" sm="4">
                      <v-switch
                        class="ma-0"
                        dense
                        inset
                        hide-details
                        :disabled="!selectedIndices.includes(i)"
                        v-model="type.value.multiple"
                        label="Multiple"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-switch
                        class="ma-0"
                        dense
                        inset
                        hide-details
                        :disabled="!selectedIndices.includes(i)"
                        v-model="type.value.allowCustom"
                        label="Custom values"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </check-box-card-item>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </check-box-card-group>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import CheckBoxCardGroup from "@/components/Base/CheckBoxCardGroup";
import CheckBoxCardItem from "@/components/Base/CheckBoxCardItem";

export default {
  name: "FieldTypeSelector",
  props: {
    type: {
      type: Object,
      required: true,
    },
  },
  components: { CheckBoxCardItem, CheckBoxCardGroup },
  setup(props, { emit }) {
    const computedType = computed({
      get() {
        return props.type;
      },
      set(val) {
        return emit("update:type", val ?? {});
      },
    });
    const typesOptions = ref([
      {
        title: "Simple text",
        description: "Plain text property",
        value: {
          uiType: "text",
          type: "string",
          fallBackValue: "",
          testValue: "",
        },
        selected: true,
      },
      {
        title: "Text area",
        description: "Longer plain text property",
        value: {
          uiType: "textArea",
          type: "string",
          fallBackValue: "",
          testValue: "Some longer text",
        },
        selected: false,
      },
      {
        title: "Rich text",
        description: "Rich text with formatting options",
        value: {
          uiType: "richText",
          type: "string",
          fallBackValue: "",
          testValue: "",
        },
        selected: false,
      },
      {
        title: "Number",
        description: "Any Number input",
        value: {
          uiType: "number",
          type: "number",
          fallBackValue: "",
          testValue: 145,
        },
        selected: false,
      },
      {
        title: "Date",
        description: "Date selection",
        value: {
          uiType: "date",
          type: "string",
          fallBackValue: "",
          testValue: "2022-04-06T07:42:43.476Z",
        },
        selected: false,
      },
      {
        title: "Boolean",
        description: "The value can be true or false",
        value: {
          uiType: "boolean",
          type: "boolean",
          fallBackValue: false,
          testValue: false,
        },
        selected: false,
      },
      {
        title: "Enumeration",
        description:
          "List of values that can be picked. You can allow custom values",
        value: {
          multiple: false,
          allowCustom: false,
          options: "",
          uiType: "select",
          type: "string",
          fallBackValue: [],
          testValue: "",
        },
        selected: false,
      },
    ]);
    return {
      scopeProperties: ["entityType", "resourceType"],
      typesOptions,
      computedType,
    };
  },
};
</script>

<style scoped></style>
