<template>
  <img class="card-bg-bottom" src="@/assets/home_imgs/card_bottom.png" />
</template>

<script>
export default {
  name: "WaveBgBottom",
};
</script>

<style scoped>
.card-bg-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.4;
}
</style>
