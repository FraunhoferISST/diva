<template>
  <section id="reviews">
    <v-container fluid class="pa-0">
      <v-row dense class="mb-16">
        <v-col cols="12" class="d-flex justify-center">
          <entity-rating :id="id" :dense="false" />
        </v-col>
        <v-col cols="12">
          <new-review-form :id="id" />
        </v-col>
      </v-row>
      <v-row class="mt-12">
        <data-viewer :loading="loading" :error="error" class="full-width">
          <template>
            <fade-in>
              <v-col cols="12" v-if="reviews.length > 0">
                <v-row>
                  <v-col
                    cols="12"
                    v-for="(review, i) in reviews"
                    :key="review.id"
                  >
                    <fade-in>
                      <review-card
                        :review="review"
                        @patch="(updatedReview) => onPatch(i, updatedReview)"
                        @delete="() => onDelete(i)"
                      ></review-card>
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
import ReviewCard from "@/components/Entity/EntityCommonComponents/Reviews/ReviewCard";
import FadeIn from "@/components/Transitions/FadeIn";
import NoDataState from "@/components/Base/NoDataState";
import NewReviewForm from "@/components/Entity/EntityCommonComponents/Reviews/NewReviewForm";
import Observer from "@/components/Base/Observer";
import { useRequest } from "@/composables/request";
import { useBus } from "@/composables/bus";
import { useUser } from "@/composables/user";
import DataViewer from "@/components/DataFetchers/DataViewer";
import { useApi } from "@/composables/api";
import EntityRating from "@/components/Entity/EntityRating";

export default {
  name: "EntityReviews",
  components: {
    EntityRating,
    DataViewer,
    Observer,
    NoDataState,
    FadeIn,
    ReviewCard,
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
    const {
      reviews: reviewsApi,
      getEntityApiById,
      getCollectionNameById,
    } = useApi();
    const { on } = useBus();
    const { user } = useUser();
    return {
      error,
      loading,
      user,
      reviewsApi,
      on,
      getEntityApiById,
      getCollectionNameById,
      request,
    };
  },
  data: () => ({
    reviews: [],
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
      return this.request(
        this.loadPage(null).then(({ cursor, collection }) => {
          this.reviews = collection;
          this.cursor = cursor;
        })
      );
    },
    async loadPage(cursor = this.cursor) {
      return this.reviewsApi
        .get({
          pageSize: 30,
          attributedTo: this.id,
          ...(cursor ? { cursor } : {}),
        })
        .then(async ({ data: { collection, cursor } }) => {
          const creatorsGroups = collection.reduce((group, entry) => {
            const { creatorId } = entry;
            const collectionName = this.getCollectionNameById(creatorId);
            group[collectionName] = group[collectionName] ?? [];
            group[collectionName].push(creatorId);
            return group;
          }, {});
          const creators = (
            await Promise.all(
              Object.entries(creatorsGroups).map(([collectionName, ids]) =>
                this.$api[collectionName].getManyById(ids)
              )
            )
          ).flat();
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
    onPatch(index, review) {
      this.reviews.splice(index, 1, review);
    },
    onDelete(index) {
      this.reviews.splice(index, 1);
    },
  },
  mounted() {
    this.loadFirstPage();
    this.on("reload", () => this.loadFirstPage());
  },
};
</script>
