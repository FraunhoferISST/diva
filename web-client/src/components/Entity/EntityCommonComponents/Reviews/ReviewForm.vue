<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12">
        <v-textarea
          color="blue"
          clearable
          hide-details
          label="Your Comment"
          placeholder=""
          v-model="reviewTextModel"
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
              v-model="ratingModel"
              hover
              color="orange"
              dense
              background-color="grey lighten-1"
            ></v-rating>
          </v-col>
          <v-col cols="12" sm="12" md="6" class="text-sm-right">
            <v-btn
              class="mr-3"
              rounded
              color="primary"
              small
              text
              @click="onCancel"
            >
              Cancel
            </v-btn>
            <slot :review-text="reviewTextModel" :rating="ratingModel">
              <v-btn
                class="gprimary"
                rounded
                color="primary"
                @click="onSave"
                :disabled="!reviewTextModel || !(ratingModel > 0)"
                :loading="isLoading"
              >
                send
              </v-btn>
            </slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ReviewForm",
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    reviewText: {
      type: String,
      required: false,
      default: "",
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      reviewTextModel: this.reviewText,
      ratingModel: this.rating,
    };
  },
  methods: {
    onSave() {
      this.$emit("save", {
        reviewText: this.reviewTextModel,
        rating: this.rating,
      });
    },
    onCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped lang="scss"></style>
