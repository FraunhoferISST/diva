<template>
  <v-container fluid class="pa-0">
    <v-row dense v-if="data">
      <v-col cols="12" sm="12" md="6" lg="7" xl="8">
        <v-row dense>
          <v-col
            cols="12"
            sm="6"
            v-for="data in personalData"
            :key="data.title"
          >
            <info-block :title="data.title" :value="data.value"></info-block>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="6"
        lg="5"
        xl="4"
        class="d-flex align-center justify-center"
      >
        <vue-ellipse-progress
          :progress="parseFloat(data.evaluatedPrivacy || 0)"
          :size="200"
          :color="color"
          :thickness="4"
          emptyColor="transparent"
          :emptyColorFill="emptyColorFill"
          font-color="white"
          font-size="2rem"
          animation="rs 500 1500 "
          :width="15"
        >
          <template v-slot:default="{ counterTick }">
            <span
              :style="{ color: color, fontWeight: 'bold', transition: '0.3s' }"
            >
              {{ counterTick.currentValue }}
            </span>
          </template>
        </vue-ellipse-progress>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
export default {
  name: "PersonalDataEvaluation",
  components: { InfoBlock },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    color() {
      if (!this.data) {
        return "gray";
      } else if (this.data.evaluatedPrivacy >= 75) {
        return "#F08080";
      } else if (this.data.evaluatedPrivacy >= 50) {
        return "#FF8C00";
      } else if (this.data.evaluatedPrivacy >= 25) {
        return "#FFD700";
      } else if (this.data.evaluatedPrivacy >= 10) {
        return "#BDB76B";
      } else {
        return "#20a66f";
      }
    },
    emptyColorFill() {
      return {
        radial: true,
        colors: [
          {
            color: this.color,
            offset: "60",
            opacity: "0.3",
          },
          {
            color: this.color,
            offset: "60",
            opacity: "0.2",
          },
          {
            color: this.color,
            offset: "80",
            opacity: "0.1",
          },
          {
            color: this.color,
            offset: "80",
            opacity: "0.06",
          },
          {
            color: this.color,
            offset: "100",
            opacity: "0.03",
          },
        ],
      };
    },
    personalData() {
      return [
        {
          title: "E-mails",
          value: this.data?.numberOfFoundEmails,
        },
        {
          title: "Phone numbers",
          value: this.data?.numberOfFoundPhoneNumbers,
        },
        {
          title: "Organizations",
          value: this.data?.numberOfFoundOrganizations,
        },
        {
          title: "Persons",
          value: this.data?.numberOfFoundPersons,
        },
        {
          title: "Addresses",
          value: this.data?.numberOfFoundLocations,
        },
      ].map((data) => ({
        ...data,
        value: data.value ?? "N/A",
      }));
    },
  },
};
</script>

<style lang="scss">
h1 {
  color: #17196d;
  font-size: 1rem !important;
  font-weight: bold !important;
  letter-spacing: 0.06rem;
}
</style>
