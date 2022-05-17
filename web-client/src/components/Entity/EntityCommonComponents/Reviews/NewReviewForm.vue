<template>
  <div class="new-comment-container" :class="{ expanded: showForm }">
    <div
      class="new-comment-form-container pl-3 pr-3"
      :class="{
        expanded: showForm,
        'pt-3': showForm,
      }"
    >
      <fade-in>
        <v-row v-if="showForm">
          <v-col cols="12">
            <v-textarea
              color="blue"
              clearable
              hide-details
              label="Your Comment"
              placeholder=""
              v-model="reviewText"
              outlined
              class="resource-desc-edit"
              :rows="5"
              no-resize
              autofocus
            >
            </v-textarea>
          </v-col>
          <v-col class="pt-0" cols="12">
            <v-row>
              <v-col class="pb-0" cols="12" sm="12" md="6">
                <v-rating
                  v-model="rating"
                  hover
                  color="orange"
                  background-color="grey lighten-1"
                ></v-rating>
              </v-col>
              <v-col cols="12" sm="12" md="6" class="text-sm-right">
                <v-btn
                  class="gprimary"
                  :block="currentBreakPoint.smAndDown"
                  min-width="200px"
                  rounded
                  color="primary"
                  @click="() => createReview()"
                  :disabled="!rating || !reviewText"
                  :loading="loading"
                >
                  Send
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </fade-in>
      <v-snackbar text :color="color" v-model="snackbar" absolute>
        {{ message }}
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import FadeIn from "@/components/Transitions/FadeIn";
import { useUser } from "@/composables/user";
import { useSnackbar } from "@/composables/snackbar";
import { useApi } from "@/composables/api";
import { useRequest } from "@/composables/request";
import { ref } from "@vue/composition-api";

export default {
  name: "NewReviewForm",
  components: {
    FadeIn,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const showForm = ref(true);
    const reviewText = ref("");
    const rating = ref(null);
    const { snackbar, message, color, show } = useSnackbar();
    const { request, loading, error } = useRequest();
    const { reviews } = useApi(props.id);
    const { user } = useUser();
    return {
      user,
      snackbar,
      message,
      color,
      rating,
      reviewText,
      showForm,
      loading,
      error,
      show,
      createReview: () => {
        request(
          reviews
            .create({
              reviewText: reviewText.value,
              title:
                reviewText.value.length > 150
                  ? `${reviewText.value.slice(0, 150)}...`
                  : reviewText.value,
              rating: rating.value,
              attributedTo: props.id,
              creatorId: user.value.id,
            })
            .then(() => show("Thanks for your opinion", { color: "success" }))
            .then(() =>
              setTimeout(() => {
                showForm.value = false;
              }, 1500)
            )
        ).then(() => {
          if (error.value) {
            let msg = error.value?.response?.data?.message ?? error.value;
            if (error.value?.response?.data?.code === 403) {
              msg =
                "According to system entities your not allowed to create a review";
            }
            show(msg, {
              color: "error",
            });
          }
        });
      },
    };
  },
  computed: {
    currentBreakPoint() {
      return this.$vuetify.breakpoint;
    },
  },
};
</script>

<style scoped lang="scss">
$transition: 0.7s;
.new-comment-container {
  transition: $transition;
  position: relative;
  top: 0;
  margin: 0 20%;
  &.expanded {
    top: 20px;
  }
}
.add-comment-btn {
  transition: $transition;
  left: 5%;
  bottom: -28px;
  position: absolute;
  &.expanded {
    background-color: transparent;
    //transform: rotate(45deg);
  }
  &.done {
    background-color: transparent;
    //transform: rotate(0);
  }
}
.new-comment-form-container {
  overflow: hidden;
  max-height: 0;
  transition: $transition;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 0px 80px rgba(0, 0, 0, 0.1),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086);
  &.expanded {
    @include border-radius();
    background-color: white;
    padding-bottom: 12px !important;
    max-height: 300px;
  }
}

@media screen and (max-width: 959px) {
  .new-comment-container {
    margin: 0 1%;
  }
}
@media screen and (max-width: 599px) {
  .new-comment-form-container {
    &.expanded {
      max-height: 300px;
    }
  }
}
</style>
