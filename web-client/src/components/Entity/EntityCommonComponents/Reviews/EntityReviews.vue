<template>
  <section id="reviews">
    <v-container fluid class="pa-0">
      <v-row class="mb-16">
        <v-col cols="12">
          <rating-overview :id="id" :itemCount="reviewsCount">
            <new-review-form :id="id" :show-form="showForm" />
          </rating-overview>
        </v-col>
      </v-row>
      <v-row class="mt-12">
        <data-viewer :loading="loading" :error="error" class="full-width">
          <template>
            <fade-in>
              <v-col cols="12" v-if="reviews.length > 0">
                <v-row>
                  <v-col cols="12" v-for="review in reviews" :key="review.id">
                    <fade-in>
                      <review-card :review="review"></review-card>
                    </fade-in>
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-else cols="12">
                <no-data-state
                  text="No reviews yet. Be the first who adds a review"
                />
              </v-col>
            </fade-in>
          </template>
        </data-viewer>
      </v-row>
    </v-container>
    <observer @intersect="loadNextPage" />
  </section>
</template>

<script>
import RatingOverview from "@/components/Entity/EntityCommonComponents/Reviews/RatingOverview";
import ReviewCard from "@/components/Entity/EntityCommonComponents/Reviews/ReviewCard";
import FadeIn from "@/components/Transitions/FadeIn";
import NoDataState from "@/components/Base/NoDataState";
import NewReviewForm from "@/components/Entity/EntityCommonComponents/Reviews/NewReviewForm";
import Observer from "@/components/Base/Observer";
import { useRequest } from "@/composables/request";
import { useBus } from "@/composables/bus";
import { useUser } from "@/composables/user";
import DataViewer from "@/components/DataFetchers/DataViewer";

export default {
  name: "EntityReviews",
  components: {
    DataViewer,
    Observer,
    NoDataState,
    FadeIn,
    ReviewCard,
    RatingOverview,
    NewReviewForm,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { request, error, loading } = useRequest();
    const { on } = useBus();
    const { user } = useUser();
    return {
      request,
      error,
      loading,
      on,
      user,
    };
  },
  data: () => ({
    reviews: [],
    showForm: true,
  }),
  computed: {
    reviewsCount() {
      return this.reviews.length;
    },
  },
  methods: {
    loadNextPage(observerState) {
      if (this.cursor) {
        observerState.loading = true;
        this.loadPage()
          .then(({ collection, cursor }) => {
            this.reviews.push(...collection);
            this.cursor = cursor;
          })
          .catch((e) => {
            observerState.error = true;
            throw e;
          })
          .finally(() => (observerState.loading = false));
      }
    },
    loadFirstPage() {
      /* this.userAlreadyWroteReview().then(
        (wroteReview) => (this.showForm = wroteReview)
      );*/
      return this.request(
        this.loadPage(null).then(({ cursor, collection }) => {
          this.reviews = collection;
          this.cursor = cursor;
        })
      );
    },
    async loadPage(cursor = this.cursor) {
      return this.$api.reviews
        .get({
          pageSize: 30,
          attributedTo: this.id,
          ...(cursor ? { cursor } : {}),
        })
        .then(async ({ data: { collection, cursor } }) => {
          /*this.showForm = !(await this.userAlreadyWroteReview());*/
          const creators = await this.$api.users.getManyById(
            collection.map(({ creatorId }) => creatorId)
          );
          const reviewsWithCreators = collection.map((review) => ({
            ...review,
            creator: creators.find(({ id }) => id === review.creatorId),
          }));
          return {
            collection: reviewsWithCreators,
            cursor,
          };
        });
    },
    userAlreadyWroteReview() {
      return this.$api.reviews
        .get({
          creatorId: this.user.id,
          attributedTo: this.id,
          pageSize: 1,
        })
        .then(({ data: { collectionSize } }) => collectionSize > 0)
        .catch(() => true);
    },
  },
  mounted() {
    this.loadFirstPage();
    this.on("reload", () => this.loadFirstPage());
  },
};
</script>
