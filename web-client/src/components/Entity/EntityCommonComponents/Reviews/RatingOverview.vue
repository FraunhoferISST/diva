<template>
  <div class="average-rating-container">
    <data-viewer :loading="loading" :error="error">
      <template>
        <v-row>
          <v-col class="justify-center d-flex py-4" cols="12">
            <vue-ellipse-progress
              :progress="ratingPercent || 0"
              color="#7579ff"
              :thickness="4"
              :empty-thickness="0"
              emptyColor="transparent"
              :emptyColorFill="emptyColorFill"
              :legendValue="formattedRating || 0"
              legendClass="average-rating"
              :legend="!!formattedRating"
              line-mode="in 5"
              :determinate="loading"
            >
              <template #legend-caption>
                <v-rating
                  v-model="formattedRating"
                  hover
                  readonly
                  color="orange"
                  half-increments
                  dense
                  background-color="grey lighten-1"
                  small
                ></v-rating>
                <sub-header
                  :text="`${itemCount} Review${pluralizeReviews}`"
                ></sub-header>
              </template>
            </vue-ellipse-progress>
          </v-col>
        </v-row>
      </template>
    </data-viewer>
    <slot></slot>
  </div>
</template>

<script>
import SubHeader from "@/components/Base/SubHeader";
import { wait } from "@/utils/utils";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useRequest } from "@/composables/request";
import { useUser } from "@/composables/user";

const waveColor = "#004aef";

export default {
  name: "RatingOverview",
  components: {
    DataViewer,
    SubHeader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const { request, loading, error } = useRequest();
    const { user } = useUser();
    return {
      request,
      loading,
      error,
      user,
    };
  },
  data: () => ({
    averageRating: 0,
    initialized: false,
    emptyColorFill: {
      radial: true,
      colors: [
        {
          color: waveColor,
          offset: "60",
          opacity: "0",
        },
        {
          color: waveColor,
          offset: "60",
          opacity: "0",
        },
        {
          color: waveColor,
          offset: "90",
          opacity: "0",
        },
        {
          color: waveColor,
          offset: "90",
          opacity: "0.2",
        },
        {
          color: waveColor,
          offset: "100",
          opacity: "0.03",
        },
      ],
    },
  }),
  computed: {
    formattedRating() {
      return Number(this.averageRating ? this.averageRating.toFixed(1) : 0.0);
    },
    ratingPercent() {
      return (this.averageRating * 100) / 5;
    },
    pluralizeReviews() {
      return this.itemCount === 0 || this.itemCount > 1 ? "s" : "";
    },
  },
  methods: {
    async fetchRating() {
      if (this.initialized) {
        await wait(2000);
      }
      return this.request(
        this.$api.analytics
          .averageRating(this.id)
          .then((response) => (this.averageRating = response?.data))
          .finally(() => {
            this.initialized = true;
          })
      );
    },
  },
  mounted() {
    this.fetchRating();
  },
};
</script>

<style lang="scss">
.average-rating-container {
  @include border-radius();
  background-color: $bg_card;
  position: relative;
}

.average-rating {
  letter-spacing: 0.3rem;
  @include font-style(2rem, $font_header, normal, $font_primary_color);
}
</style>
