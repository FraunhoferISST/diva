<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-combobox
          v-model="name"
          label="Destroy Reason Name"
          type="text"
          placeholder="The name of the Destroy Reason"
          :items="destroyReasonsList"
          hide-details
          clearable
          outlined
          hide-no-data
          @input="($event) => onSelect($event, 'name')"
          dense
          item-text="name"
          item-value="name"
          full-width
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
        </v-combobox>
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="value"
          :items="destroyReasonsList"
          hide-details="auto"
          label="Destroy Reason Value"
          placeholder="Specify a Destroy Reason Value"
          clearable
          outlined
          hide-no-data
          type="text"
          required
          :rules="[(value) => !!value || 'required']"
          @input="($event) => onSelect($event, 'value')"
          dense
          item-text="value"
          item-value="value"
        >
          <template #item="data">
            <template>
              <v-list-item-content>
                <v-list-item-title>
                  {{ truncateText(data.item.value) }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-combobox>
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
      value: this.destroyReason.value,
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
      if (val && typeof val === "object") {
        this.computedDestroyReason = {
          ...val,
        };
        this.value = val.value;
        this.name = val.name;
      } else {
        this.onEdit(val, prop);
      }
    },
    onEdit(val, prop) {
      this.computedDestroyReason = {
        ...this.computedDestroyReason,
        [prop]: val ?? "",
      };
    },
    emitRemove() {
      this.$emit("remove");
    },
  },
};
</script>
<style scoped></style>
