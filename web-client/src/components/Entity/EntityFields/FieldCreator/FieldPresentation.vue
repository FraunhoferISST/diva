<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12">
        <check-box-card-group :items="viewsOptions" :selected.sync="view">
          <template #default="{ toggle, selectedIndices }">
            <v-container fluid class="pa-0">
              <v-row dense>
                <v-col
                  cols="12"
                  sm="6"
                  v-for="(view, i) in viewsOptions"
                  :key="i"
                >
                  <check-box-card-item
                    :active="selectedIndices.includes(i)"
                    :title="view.title"
                    @clicked="() => toggle(i)"
                  >
                    <div>
                      {{ view.description }}
                    </div>
                  </check-box-card-item>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </check-box-card-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="computedPresentation.position"
          label="Field position on the page"
          outlined
          dense
          type="number"
          step="1"
          rounded
          hide-details
          background-color="transparent"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-switch
          dense
          inset
          hide-details
          class="ma-0"
          v-model="computedPresentation.fullWidth"
          label="Full width"
        ></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed, ref, watch } from "@vue/composition-api";
import CheckBoxCardItem from "@/components/Base/CheckBoxCardItem";
import CheckBoxCardGroup from "@/components/Base/CheckBoxCardGroup";

export default {
  name: "FieldPresentation",
  components: { CheckBoxCardGroup, CheckBoxCardItem },
  props: {
    presentation: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const computedPresentation = computed({
      get() {
        return props.presentation;
      },
      set(val) {
        return emit("update:presentation", val ?? {});
      },
    });
    const view = ref({});
    watch(view, () => {
      if (view.value) {
        computedPresentation.value.view = view.value.view;
      }
    });
    return {
      viewsOptions: [
        {
          title: "Overview page",
          description: "The main overview page of a resource",
          value: {
            view: "overview",
          },
        },
        {
          title: "Profiling page",
          description: "Entity profiling page",
          value: {
            view: "profiling",
          },
        },
      ],
      view,
      computedPresentation,
    };
  },
};
</script>

<style scoped></style>
