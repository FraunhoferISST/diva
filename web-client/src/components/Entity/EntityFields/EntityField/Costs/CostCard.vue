<template>
  <colored-card class="fill-height">
    <div slot="body">
      <h3 class="cost-card-header">
        {{ title }}
      </h3>
      <div v-if="isValidPrice">
        <p class="ma-0">
          <span class="cost-card-value">{{
            Number(costsData.value).toFixed(2)
          }}</span>
          <span class="cost-card-currency ml-1">{{ costsData.currency }}</span>
        </p>
        <span v-if="costsData.period" class="cost-card-period">{{
          costsData.period || ""
        }}</span>
      </div>
      <no-data-state
        class="mt-3"
        v-else
        text="No costs defined yet"
      ></no-data-state>
    </div>
  </colored-card>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
import ColoredCard from "@/components/Base/ColoredCard";
export default {
  name: "CostCard",
  components: { ColoredCard, NoDataState },
  props: {
    title: {
      type: String,
      required: true,
    },
    costsData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isValidPrice() {
      return (
        this.costsData.value !== null &&
        this.costsData.value !== "" &&
        this.costsData.value >= 0
      );
    },
  },
};
</script>

<style scoped lang="scss">
.cost-card-header {
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  @include font-style(
    $size: 0.7rem,
    $family: $font_body,
    $weight: bolder,
    $color: $font_secondary_color_inverse
  );
}
.cost-card-value {
  letter-spacing: 0.2rem;
  @include font-style(
    $size: 2rem,
    $family: $font_header,
    $weight: bolder,
    $color: $font_primary_color_inverse
  );
}
.cost-card-currency {
  letter-spacing: 0.2rem;
  @include font-style(
    $size: 1.2rem,
    $family: $font_header,
    $weight: bolder,
    $color: rgba($font_secondary_color_inverse, 1)
  );
}
.cost-card-period {
  padding: 2px 10px;
  @include border-radius-half;
  letter-spacing: 0.05rem;
  background-color: $btn_flat_secondary_text;
  @include font-style(
    $size: 0.8rem,
    $family: $font_body,
    $weight: bolder,
    $color: rgba($btn_flat_secondary, 1)
  );
}
</style>
