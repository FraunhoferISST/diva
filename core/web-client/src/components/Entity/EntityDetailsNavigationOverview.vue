<template>
  <div class="overview-card-container pa-0" v-if="data.id">
    <div class="overview-card" :class="{ closed: closed, 'pa-3': !closed }">
      <v-container class="pa-0" fluid>
        <v-row dense class="text-center mb-2">
          <v-col class="pa-0" cols="12">
            <div
              class="overview-card-icon-container"
              :class="{ closed: closed }"
            >
              <identicon
                :options="{ size: 44 }"
                :hash="data.uniqueFingerprint || data.id"
              />
            </div>
          </v-col>
          <fade-in>
            <v-col cols="12" v-if="!closed">
              <h4 class="text-truncate overview-card-title">
                {{ data.title }}
              </h4>
            </v-col>
          </fade-in>
        </v-row>

        <fade-in>
          <v-row class="text-center">
            <v-col>
              <v-row dense class="mb-2" v-if="!closed">
                <v-col class="pt-0" cols="6">
                  <v-chip
                    class="my-0 mr-2 font-weight-bold ull-width d-flex justify-center"
                    label
                    color="info"
                    small
                    bold
                  >
                    {{ data.resourceType || data.assetType }}
                  </v-chip>
                </v-col>
                <v-col class="pt-0" cols="6">
                  <v-chip
                    class="my-0 mr-2 font-weight-bold full-width d-flex justify-center"
                    label
                    color="info"
                    small
                    bold
                  >
                    {{ data.entityType }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-row dense class="mb-2" v-if="!closed">
                <v-col class="pt-0" cols="6">
                  <info-block title="Created" dense>
                    <template #value>
                      <date-display :date="data.created" format="DD.MM.YYYY" />
                    </template>
                  </info-block>
                </v-col>
                <v-col class="pt-0" cols="6">
                  <info-block title="Modified" dense>
                    <template #value>
                      <date-display :date="data.modified" format="DD.MM.YYYY" />
                    </template>
                  </info-block>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </fade-in>

        <fade-in>
          <v-row dense class="mb-2" v-if="!closed">
            <v-col cols="12">
              <info-block title="Creator">
                <template #value>
                  <user-link :user="creator" />
                </template>
              </info-block>
            </v-col>
            <v-col cols="12" class="mt-4">
              <info-block title="Owner">
                <template #value>
                  <user-link :user="owner" />
                </template>
              </info-block>
            </v-col>
          </v-row>
        </fade-in>
        <v-row v-if="data.profilingExists">
          <v-col class="py-8">
            <v-btn
              block
              small
              color="primary"
              rounded
              :loading="loading"
              :disabled="profilingInitiated"
              @click="runProfiling"
            >
              {{ profilingInitiated ? "profiling initiated" : "profile" }}
            </v-btn>
          </v-col>
        </v-row>
        <v-snackbar
          min-width="0"
          width="280px"
          absolute
          rounded
          :timeout="10000"
          bottom
          text
          v-model="snackbar"
          :color="snackbarColor"
          style="bottom: 20px; font-weight: bold"
        >
          {{ snackbarText }}
        </v-snackbar>
      </v-container>
    </div>
  </div>
</template>

<script>
import Identicon from "@/components/Base/Identicon";
import DateDisplay from "@/components/Base/DateDisplay";
import FadeIn from "@/components/Transitions/FadeIn";
import UserLink from "@/components/Base/UserLink";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";

export default {
  name: "EntityDetailsNavigationOverview",
  components: {
    InfoBlock,
    UserLink,
    FadeIn,
    DateDisplay,
    Identicon,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    closed: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    snackbar: false,
    snackbarText: "",
    snackbarColor: "success",
    profilingInitiated: false,
  }),
  watch: {
    closed(isClosed) {
      if (isClosed) {
        this.snackbar = false;
      }
    },
  },
  computed: {
    creator() {
      return this.data.creator;
    },
    owner() {
      return this.data.owner;
    },
  },
  methods: {
    runProfiling() {
      this.loading = true;
      this.$api.profiling
        .run({ resourceId: this.data.id })
        .then(() => {
          this.profilingInitiated = true;
          this.showSnackbar();
        })
        .catch((e) =>
          this.showSnackbar(
            `${
              e?.response?.data?.message ?? e.toString()
            }. Please try again later`,
            "error"
          )
        )
        .finally(() => {
          this.loading = false;
        });
    },
    showSnackbar(msg = "Profiling successfully initiated", color = "success") {
      this.snackbarText = msg;
      this.snackbarColor = color;
      this.snackbar = true;
    },
  },
};
</script>

<style scoped lang="scss">
.overview-card {
  transition: 0.5s;
  position: relative;
  background-color: rgba($bg_card, 1);
  @include border-radius(0, 0, 0, 50px);
  width: 100%;
  //box-shadow: 0 0 15px 10px rgba(black, 0.05);
  max-height: 460px;
  padding-bottom: 20px;
  overflow: hidden;
  &.closed {
    max-height: 110px;
  }
}

.overview-card-type {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 4px;
  @include gradient-primary(0.5, 0.5);
  @include font-style(0.9rem, $font_header, bold, $font_secondary_color);
}

.overview-card-icon-container {
  position: relative;
  transition: 0.5s;
  &.closed {
    padding: 25px 0 20px 0;
  }
}

.overview-card-stat-title {
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin-bottom: 5px;
  display: block;
  @include font-style(0.7rem, $font_body, bold, $font_secondary_color);
}

.overview-card-title {
  @include font-style(
    $size: 0.9rem,
    $weight: bold,
    $color: $font_primary_color
  );
}

.overview-card-controls {
  transition: 0.5s;
  position: absolute;
  right: 15px;
  top: 10px;
  max-width: 28px;
  &.closed {
    right: 25px;
    top: 10px;
  }
}

.overview-card-stat-value {
  @include font-style(0.7rem, $font_header, bold, $font_primary_color);
}
</style>
