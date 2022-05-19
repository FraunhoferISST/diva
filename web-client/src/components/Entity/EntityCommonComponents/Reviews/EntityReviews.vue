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
import { onMounted, ref } from "@vue/composition-api/dist/vue-composition-api";
import { computed } from "@vue/composition-api";

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
  setup(props) {
    const cursor = ref(null);
    const reviews = ref([]);
    const { request, error, loading } = useRequest();
    const { reviews: reviewsApi, getCollectionNameById, api } = useApi();
    const { on } = useBus();
    const { user } = useUser();
    const loadPage = (_cursor = cursor.value) =>
      reviewsApi
        .get({
          pageSize: 50,
          attributedTo: props.id,
          ...(_cursor ? { _cursor } : {}),
        })
        .then(async ({ data: { collection, cursor: c } }) => {
          const creatorsGroups = collection.reduce((group, entry) => {
            const { creatorId } = entry;
            const collectionName = getCollectionNameById(creatorId);
            group[collectionName] = group[collectionName] ?? [];
            group[collectionName].push(creatorId);
            return group;
          }, {});
          const creators = (
            await Promise.all(
              Object.entries(creatorsGroups).map(([collectionName, ids]) =>
                api[collectionName].getManyById(ids)
              )
            )
          ).flat();
          const reviewsWithCreators = collection.map((entry) => ({
            ...entry,
            creator: creators.find(({ id }) => id === entry.creatorId) ?? {},
          }));
          return {
            collection: reviewsWithCreators,
            cursor: c,
          };
        });
    const loadFirstPage = () =>
      request(
        loadPage(null).then(({ collection, cursor: c }) => {
          reviews.value = collection;
          cursor.value = c;
        })
      );
    onMounted(() => {
      loadFirstPage();
      on("reload", loadFirstPage);
    });
    return {
      reviews,
      error,
      loading,
      user,
      reviewsCount: computed(() => reviews.value.length),
      loadNextPage: (changeStateMethod) => {
        if (cursor.value) {
          changeStateMethod({ loading: true });
          loadPage()
            .then(({ collection, cursor: c }) => {
              reviews.value.push(...collection);
              cursor.value = c;
              if (!cursor.value) {
                changeStateMethod({ completed: true });
              }
            })
            .catch((e) => {
              changeStateMethod({ error: true, loading: false });
              throw e;
            })
            .finally(() => changeStateMethod({ loading: false }));
        }
      },
      onPatch: (index, review) => {
        reviews.value.splice(index, 1, review);
      },
      onDelete: (index) => reviews.value.splice(index, 1),
    };
  },
};
</script>
