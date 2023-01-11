<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-select
          v-model="computedDestroyReason.name"
          label="Destroy Reason"
          type="text"
          placeholder="The name of the Destroy Reason"
          :items="destroyReasonsList"
          hide-details
          outlined
          hide-no-data
          @input="($event) => onSelect($event, 'name')"
          dense
          item-text="name"
          item-value="name"
        >
          <template #item="data">
            <template>
              <v-list-item-content>
                <v-list-item-title>
                  {{ truncateText(data.item.name) }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="computedDestroyReason.value"
          v-show="computedDestroyReason.name === 'Custom Reason'"
          hide-details="auto"
          label="Custom Reason"
          placeholder="Specify a custom Destroy Reason"
          clearable
          outlined
          hide-no-data
          type="text"
          required
          :rules="[
            (value) => !!value || 'required',
            (value) => value.length > 1 || 'minimum of 2 characters required',
          ]"
          @input="($event) => onSelect($event, 'value')"
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <slot>
          <v-btn rounded small text color="error" @click="emitRemove">
            Remove Destroy Reason
          </v-btn>
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DestroyReasonsEdit",
  inheritAttrs: false,
  components: {},
  props: {
    destroyReason: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: this.destroyReason.name,
      destroyReasonsList: [
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/timeliness",
          name: "Data Quality - Timeliness",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/uniqueness",
          name: "Data Quality - Uniqueness",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/accuracy",
          name: "Data Quality - Accuracy",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/completeness",
          name: "Data Quality - Completeness",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/consistency",
          name: "Data Quality - Consistency",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/integrity",
          name: "Data Quality - Integrity",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/reasonability",
          name: "Data Quality - Reasonability",
        },
        {
          value:
            "https://fraunhoferisst.github.io/destroys/docs/why/reasons/data-quality/validity",
          name: "Data Quality - Validity",
        },
        {
          value: "",
          name: "Custom Reason",
        },
      ],
    };
  },
  computed: {
    computedDestroyReason: {
      get() {
        return this.destroyReason;
      },
      set(val) {
        this.$emit("update:destroyReason", val);
      },
    },
  },
  methods: {
    truncateText(text) {
      return text.length > 50 ? `${text.slice(0, 50)}...` : text;
    },
    onSelect(val, prop) {
      this.onEdit(val, prop);
    },
    onEdit(val, prop) {
      if (prop === "name") {
        this.computedDestroyReason = {
          name: val,
          value: this.destroyReasonsList.find((e) => e.name === val).value,
        };
      }
      if (prop === "value") {
        this.computedDestroyReason = {
          name: this.computedDestroyReason.name,
          value: val,
        };
      }
    },
    emitRemove() {
      this.$emit("remove");
    },
  },
};
</script>
<style scoped></style>
