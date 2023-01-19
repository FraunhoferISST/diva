<template>
  <v-container fill-height>
    <v-row align="center">
      <v-col cols="12" sm="4" offset-sm="4">
        <v-img
          src="@/assets/illustrations/undraw_page_not_found_re_e9o6.svg"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="4" offset-sm="4">
        <div
          id="not-found"
          class="fill-height d-flex justify-center align-center"
        >
          <div class="text-center">
            <no-data-state> The requested page were not found </no-data-state>
            <p>
              Go back or
              <router-link to="/"> start again</router-link>
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NoDataState from "@/components/Base/NoDataState";
export default {
  name: "NotFound",
  components: { NoDataState },
};
</script>

<style scoped></style>
