<template>
  <info-block :title="title">
    <template #value>
      <entity-field-selector :type="type">
        <template #default="{ viewer, editor }">
          <field-editor :data="{ [property]: value }" :on-save="patchAndMutate">
            <template #view="{ state }">
              <slot>
                <template>
                  <component
                    :is="viewer"
                    v-bind="{ ...$props, ...$attrs }"
                    :value="state[property]"
                  />
                </template>
              </slot>
            </template>
            <template #edit="{ setPatch, patch }">
              <component
                :is="editor"
                v-bind="{ ...$props, ...$attrs }"
                :property="property"
                :value="patch[property]"
                :title="title"
                @update:value="(newValue) => setPatch({ [property]: newValue })"
              />
            </template>
          </field-editor>
        </template>
      </entity-field-selector>
    </template>
  </info-block>
</template>

<script>
import { useEntity } from "@/composables/entity";
import { computed } from "@vue/composition-api";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import EntityFieldSelector from "@/components/Entity/EntityFields/EntityField/EntityFieldSelector";
import FieldEditor from "@/components/Entity/EntityFields/FieldEditor";
export default {
  name: "EntityField",
  components: {
    FieldEditor,
    EntityFieldSelector,
    InfoBlock,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    property: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Array, Boolean, Date, Object],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    mutateSource: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, { emit }) {
    const computedValue = computed({
      get: () => props.value,
      set: (val) => emit("update:value", val),
    });
    const { patch, patchLoading, patchError } = useEntity(props.id, {
      reactive: false,
    });
    const patchAndMutate = (patchData) =>
      patch(patchData).then(() => {
        if (patchError.value) {
          throw patchError.value;
        }
        if (props.mutateSource) {
          computedValue.value = patchData[props.property];
        }
      });
    return {
      patchLoading,
      patchAndMutate,
    };
  },
};
</script>

<style scoped></style>
