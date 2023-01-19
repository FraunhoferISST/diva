<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4" offset-sm="4">
        <v-img
          src="@/assets/illustrations/undraw_blank_canvas_re_2hwy.svg"
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert color="info" text class="ma-0">
          <p class="ma-0 text-center">
            We currently have no profiled data for this resource type
          </p>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "NotSupportedType",
};
</script>
