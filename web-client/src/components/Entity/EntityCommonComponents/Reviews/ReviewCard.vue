<template>
  <div class="comment">
    <div class="comment-header d-flex justify-space-between align-center">
      <actor-card
        dense
        :actor="review.creator"
        :visible="review.creator.visible"
      >
        <template #info>
          <div class="d-flex align-center">
            <v-rating
              :value="review.rating"
              hover
              readonly
              color="orange"
              background-color="grey lighten-1"
              size="14"
              dense
            ></v-rating>
            <dot-divider class="mx-3" />
            <date-display :date="review.createdAt" />
          </div>
        </template>
      </actor-card>
      <div v-if="userIsAuthor">
        <v-btn
          v-if="!isEditMode"
          class="mr-2"
          icon
          color="primary"
          small
          @click="enableEditMode"
        >
          <v-icon small> edit </v-icon>
        </v-btn>
        <v-btn icon color="error" small @click="showConfirmationDialog = true">
          <v-icon small> delete </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="review-content mt-3 px-2 pt-2">
      <div class="comment-text pa-2" v-if="review.reviewText && !isEditMode">
        {{ review.reviewText }}
      </div>
      <review-form
        v-else
        @cancel="disableEditMode"
        :review-text="review.reviewText"
        :rating="review.rating"
      >
        <template #default="{ reviewText, rating }">
          <v-btn
            class="gprimary"
            min-width="150px"
            rounded
            small
            color="primary"
            @click="() => patchReview({ reviewText, rating })"
            :disabled="!reviewText || !(rating > 0)"
            :loading="loading"
          >
            Update review
          </v-btn>
        </template>
      </review-form>
    </div>
    <confirmation-dialog
      v-if="userIsAuthor"
      :show.sync="showConfirmationDialog"
    >
      <template>
        Are you sure you want to delete your review? The changes cannot be
        rolled back!
        <v-snackbar text :color="color" v-model="snackbar" absolute>
          {{ message }}
        </v-snackbar>
      </template>
      <template #confirm>
        <v-btn
          text
          rounded
          color="error"
          @click="deleteReview"
          :loading="loading"
        >
          Delete review
        </v-btn>
      </template>
    </confirmation-dialog>
  </div>
</template>

<script>
import DateDisplay from "@/components/Base/DateDisplay";
import ReviewForm from "./ReviewForm";
import ConfirmationDialog from "../../../Base/ConfirmationDialog";
import ActorCard from "@/components/User/ActorCard";
import DotDivider from "@/components/Base/DotDivider";
import { useUser } from "@/composables/user";
import { useApi } from "@/composables/api";
import { useSnackbar } from "@/composables/snackbar";
import { useRequest } from "@/composables/request";
import { computed, ref } from "@vue/composition-api";
export default {
  name: "ReviewCard",
  components: {
    DotDivider,
    ActorCard,
    ConfirmationDialog,
    ReviewForm,
    DateDisplay,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const isEditMode = ref(false);
    const showConfirmationDialog = ref(false);
    const { user } = useUser();
    const { snackbar, message, color, show } = useSnackbar();
    const { request, error, loading } = useRequest();
    const { reviews: reviewsApi } = useApi();
    return {
      user,
      reviewsApi,
      isEditMode,
      showConfirmationDialog,
      snackbar,
      message,
      color,
      loading,
      userIsAuthor: computed(() => props.review.creatorId === user.value.id),
      enableEditMode: () => (isEditMode.value = true),
      disableEditMode: () => (isEditMode.value = false),
      patchReview: (reviewData) =>
        request(reviewsApi.patch(props.review.id, reviewData)).then(() => {
          if (error.value) {
            return show(error.value?.response?.data?.message ?? error.value, {
              color: "error",
            });
          }
          emit("patch", { ...props.review, ...reviewData });
          isEditMode.value = false;
          showConfirmationDialog.value = false;
        }),
      deleteReview: () =>
        request(reviewsApi.delete(props.review.id)).then(() => {
          if (error.value) {
            return show(error.value?.response?.data?.message ?? error.value, {
              color: "error",
            });
          }
          emit("delete", props.review);
          isEditMode.value = false;
          showConfirmationDialog.value = false;
        }),
    };
  },
};
</script>

<style scoped lang="scss">
.comment {
  position: relative;
}

.review-content {
  margin-left: 34px;
}
.comment-text {
  border: 1px #eeeeee solid;
  @include border-radius-half();
  @include font-style(0.9rem, $font_body, bold, $font_secondary_color);
}
.comment-details-divider {
  height: 100%;
  width: 3px;
  position: relative;
  &:after {
    content: "";
    display: block;
    width: 3px;
    height: 3px;
    background: gray;
    border-radius: 3px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>
