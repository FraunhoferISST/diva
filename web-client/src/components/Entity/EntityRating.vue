<template>
  <div class="entity-rating-container">
    <data-viewer :loading="loading" :error="error" :updating="reloadLoading">
      <vue-ellipse-progress
        v-if="!dense"
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
        font-size="2.5rem"
        font-color="black"
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
          <sub-header>
            {{ reviewsCount }} Review{{ pluralizeReviews }}
          </sub-header>
        </template>
      </vue-ellipse-progress>

      <v-rating
        v-else
        color="orange"
        readonly
        small
        dense
        half-increments
        :value="avgRating"
      >
      </v-rating>
    </data-viewer>
  </div>
</template>

<script>
import { useApi } from "@/composables/api";
import { ref, computed } from "@vue/composition-api";
import { useRequest } from "@/composables/request";
import { useBus } from "@/composables/bus";
import DataViewer from "@/components/DataFetchers/DataViewer";
import SubHeader from "@/components/Base/SubHeader";
const waveColor = "#004aef";
export default {
  name: "EntityRating",
  components: { SubHeader, DataViewer },
  props: {
    id: {
      type: String,
      required: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const emptyColorFill = {
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
    };
    const avgRating = ref(0);
    const reviewsCount = ref(0);
    const { on } = useBus();
    const { analytics } = useApi(props.id);
    const { request, loading, error } = useRequest();
    const {
      request: reloadReq,
      loading: reloadLoading,
      error: reloadError,
    } = useRequest();
    const loadRating = () =>
      analytics
        .averageRating(props.id)
        .then(({ data: { avgRating: avgr, reviewsCount: rc } }) => {
          avgRating.value = avgr;
          reviewsCount.value = rc;
        });
    request(loadRating());
    on("reload", () => setTimeout(() => reloadReq(loadRating()), 2000));
    return {
      emptyColorFill,
      avgRating,
      reviewsCount,
      loading,
      error,
      reloadLoading,
      reloadError,
      formattedRating: computed(() =>
        Number(avgRating.value ? avgRating.value.toFixed(1) : 0.0)
      ),
      ratingPercent: computed(() => (avgRating.value * 100) / 5),
      pluralizeReviews: computed(() =>
        reviewsCount.value === 0 || reviewsCount > 1 ? "s" : ""
      ),
    };
  },
};
</script>

<style scoped></style>
