<template>
  <section id="reviews" class="pb-12">
    <v-container fluid class="pt-6">
      <v-row>
        <v-col cols="12">
          <rating-overview :id="id" :itemCount="reviewsCount">
            <new-review-form :id="id" :show-form="showForm" />
          </rating-overview>
        </v-col>
      </v-row>
      <v-row class="mt-12">
        <reactive-data-fetcher :id="id" :fetch-method="fetchInitialReviews">
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
        </reactive-data-fetcher>
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
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
import InfiniteScroll from "@/components/Mixins/infiniteScroll";
import Observer from "@/components/Base/Observer";

export default {
  name: "EntityReviews",
  mixins: [InfiniteScroll],
  components: {
    Observer,
    ReactiveDataFetcher,
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
  data: () => ({
    reviews: [],
    showForm: false,
  }),
  computed: {
    reviewsCount() {
      return this.reviews.length;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    loadNextPage(observerState) {
      if (this.cursor) {
        this.loadPage(observerState, this.fetchReviews()).then(
          ({ collection, cursor }) => {
            this.reviews.push(...collection);
            this.cursor = cursor;
          }
        );
      }
    },
    async fetchInitialReviews() {
      this.showForm = !(await this.userAlreadyWroteReview());
      return this.fetchReviews().then(({ cursor, collection }) => {
        this.reviews = collection;
        this.cursor = cursor;
      });
    },
    async fetchReviews() {
      return this.$api.reviews
        .get({
          pageSize: 30,
          attributedTo: this.id,
          ...(this.cursor ? { cursor: this.cursor } : {}),
        })
        .then(async ({ data: { collection, cursor } }) => {
          this.showForm = !(await this.userAlreadyWroteReview());
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
        .catch(() => false);
    },
  },
};
</script>
