<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-combobox
          v-model="name"
          label="License name"
          type="text"
          placeholder="Add a title for the license"
          :items="licensesList"
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
          :items="licensesList"
          hide-details="auto"
          label="License URL"
          placeholder="Specify a license URL"
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
      <v-col cols="12" md="6">
        <v-combobox
          v-model="code"
          label="License code"
          placeholder="Add a license code"
          :items="licensesList"
          hide-details
          clearable
          outlined
          hide-no-data
          type="text"
          @input="($event) => onSelect($event, 'code')"
          dense
          item-value="code"
          item-text="code"
        >
        </v-combobox>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="attributedByText"
          label="License attributed by"
          outlined
          dense
          hide-details
          clearable
          @input="($event) => onEdit($event, 'attributedByText')"
          background-color="transparent"
        />
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <slot>
          <v-btn rounded small text color="error" @click="emitRemove">
            Remove license
          </v-btn>
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LicenseEdit",
  components: {},
  props: {
    license: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: this.license.url,
      name: this.license.name,
      code: this.license.code,
      attributedByText: this.license.attributedByText,
      licensesList: [
        {
          url: "https://www.govdata.de/dl-de/zero-2-0",
          name: "Datenlizenz Deutschland – Zero – Version 2.0",
          code: "dl-by-de/2.0",
          attributedByText: "",
        },
        {
          url: "https://www.govdata.de/dl-de/by-2-0",
          name: "Datenlizenz Deutschland – Zero – Version 2.0",
          code: "dl-zero-de/2.0",
          attributedByText: "",
        },
        {
          url: "http://creativecommons.org/licenses/by/4.0/",
          name: "Creative Commons Namensnennung – 4.0 International (CC BY 4.0)",
          code: "cbz-4.0",
          attributedByText: "",
        },
        {
          url: "http://www.apache.org/licenses",
          name: "Freie Softwarelizenz der Apache Software Foundation",
          code: "apache",
          attributedByText: "",
        },
        {
          url: "http://www.opensource.org/licenses/bsd-license.php",
          name: "BSD Lizenz",
          code: "bsdlicense",
          attributedByText: "",
        },
        {
          url: "http://www.opendefinition.org/licenses/cc-by",
          name: "Creative Commons Namensnennung (CC-BY)",
          code: "cc-by",
          attributedByText: "",
        },
        {
          url: "https://creativecommons.org/licenses/by/3.0/de/",
          name: "Creative Commons Namensnennung 3.0 Deutschland (CC BY 3.0 DE)",
          code: "cc-by-de/3.0",
          attributedByText: "",
        },
        {
          url: "http://www.opendefinition.org/licenses/cc-by-sa",
          name: "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen (CC-BY-SA)",
          code: "cc-by-sa",
          attributedByText: "",
        },
        {
          url: "https://creativecommons.org/licenses/by-sa/3.0/de/",
          name: "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 3.0 Deutschland (CC BY-SA 3.0 DE)",
          code: "cc-by-sa-de/3.0",
          attributedByText: "",
        },
        {
          url: "http://creativecommons.org/licenses/by-sa/4.0/",
          name: "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International (CC-BY-SA 4.0)",
          code: "cc-by-sa/4.0",
          attributedByText: "",
        },
        {
          url: "http://creativecommons.org/publicdomain/mark/1.0/",
          name: "Public Domain Mark 1.0 (PDM)",
          code: "ccpdm/1.0",
          attributedByText: "",
        },
        {
          url: "http://www.opendefinition.org/licenses/cc-zero",
          name: "Creative Commons CC Zero License (cc-zero)",
          code: "cc-zero",
          attributedByText: "",
        },
        {
          url: "https://www.govdata.de/dl-de/by-1-0",
          name: "Datenlizenz Deutschland Namensnennung 1.0",
          code: "dl-by-de/1.0",
          attributedByText: "",
        },
        {
          url: "https://sg.geodatenzentrum.de/web_public/gdz/lizenz/geonutzv.pdf",
          name: "Nutzungsbestimmungen für die Bereitstellung von Geodaten des Bundes",
          code: "geoNutz/20130319",
          attributedByText: "",
        },
      ],
    };
  },
  computed: {
    computedLicense: {
      get() {
        return this.license;
      },
      set(val) {
        this.$emit("update:license", val);
      },
    },
  },
  methods: {
    truncateText(text) {
      return text.length > 50 ? `${text.slice(0, 50)}...` : text;
    },
    onSelect(val, prop) {
      if (val && typeof val === "object") {
        this.computedLicense = {
          ...val,
          attributedByText: this.attributedByText ?? "",
        };
        this.url = val.url;
        this.code = val.code;
        this.name = val.name;
      } else {
        this.onEdit(val, prop);
      }
    },
    onEdit(val, prop) {
      this.computedLicense = {
        ...this.computedLicense,
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
