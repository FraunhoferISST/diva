<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-combobox
          v-model="name"
          label="Destroyclaim name"
          type="text"
          placeholder="Add a title for the destroyclaim name"
          :items="destroyclaimReasonsList"
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
          v-model="url"
          :items="destroyclaimReasonsList"
          hide-details="auto"
          label="Destroyclaim Reason URL"
          placeholder="Specify a destroyclaim reason URL"
          clearable
          outlined
          hide-no-data
          type="url"
          required
          :rules="[(value) => !!value || 'required']"
          @input="($event) => onSelect($event, 'url')"
          dense
          item-text="url"
          item-value="url"
        >
          <template #item="data">
            <template>
              <v-list-item-content>
                <v-list-item-title>
                  {{ truncateText(data.item.url) }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="additionalInfoText"
          label="Destroyclaim reason additional information"
          outlined
          dense
          hide-details
          clearable
          @input="($event) => onEdit($event, 'additionalInfoText')"
          background-color="transparent"
        />
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <slot>
          <v-btn rounded small text color="error" @click="emitRemove">
            Remove destroyclaim reason
          </v-btn>
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DestroyclaimReasonsEdit",
  inheritAttrs: false,
  components: {},
  props: {
    destroyclaimReason: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: this.destroyclaimReason.url,
      name: this.destroyclaimReason.name,
      additionalInfoText: this.destroyclaimReason.additionalInfoText,
      destroyclaimReasonsList: [
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/timeliness",
          name: "Data Quality - Timeliness",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/uniqueness",
          name: "Data Quality - Uniqueness",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/accuracy",
          name: "Data Quality - Accuracy",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/completeness",
          name: "Data Quality - Completeness",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/consistency",
          name: "Data Quality - Consistency",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/integrity",
          name: "Data Quality - Integrity",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/reasonability",
          name: "Data Quality - Reasonability",
          additionalInfoText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/data-quality/validity",
          name: "Data Quality - Validity",
          attribuadditionalInfoTexttedByText: "",
        },
        {
          url: "https://fraunhoferisst.github.io/destroyclaims/docs/why/reasons/custom",
          name: "Custom Reason",
          additionalInfoText: "",
        },
      ],
    };
  },
  computed: {
    computedDestroyclaimReason: {
      get() {
        return this.destroyclaimReason;
      },
      set(val) {
        this.$emit("update:destroyclaimReason", val);
      },
    },
  },
  methods: {
    truncateText(text) {
      return text.length > 50 ? `${text.slice(0, 50)}...` : text;
    },
    onSelect(val, prop) {
      if (val && typeof val === "object") {
        this.computedDestroyclaimReason = {
          ...val,
          additionalInfoText: this.additionalInfoText ?? "",
        };
        this.url = val.url;
        this.name = val.name;
      } else {
        this.onEdit(val, prop);
      }
    },
    onEdit(val, prop) {
      this.computedDestroyclaimReason = {
        ...this.computedDestroyclaimReason,
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
