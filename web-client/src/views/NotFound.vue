<template>
  <div id="not-found" class="fill-height d-flex justify-center align-center">
    <div class="text-center">
      <no-data-state> The requested page were not found </no-data-state>
      <p>
        Go back or
        <router-link to="/"> start again</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "NotFound",
  components: { NoDataState },
};
</script>

<style scoped></style>
