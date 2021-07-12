<template>
  <v-container class="pa-0 fill-height" fluid>
    <colored-card
      :padding="false"
      :rounded="false"
      class="full-width fill-height"
    >
      <template slot="body">
        <div
          class="text-center action-container d-flex column wrap justify-center align-center"
        >
          <div class="action-content pa-2">
            <custom-header
              class="mb-3 hidden-sm-and-down"
              text="Import new data"
            ></custom-header>
            <p class="hidden-sm-and-down">
              Upload a file from local disk or provide access to connect to your
              data source
            </p>
            <div>
              <v-btn
                x-large
                rounded
                block
                color="primary"
                class="gsecondary"
                :disabled="!isReady"
                :loading="isLoading"
                @click="emitCreate"
              >
                import data
              </v-btn>
            </div>
          </div>
        </div>
      </template>
    </colored-card>
  </v-container>
</template>

<script>
import ColoredCard from "@/components/Base/ColoredCard";
import CustomHeader from "@/components/Base/CustomHeader";

export default {
  name: "CreateButtonSection",
  components: {
    CustomHeader,
    ColoredCard,
  },
  props: {
    isReady: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    emitCreate() {
      this.$emit("create");
    },
  },
};
</script>

<style scoped lang="scss">
.action-container {
  position: relative;
  z-index: 2;
  transition: 0.5s;
  // background-color: $bg_dark;
  height: 100%;
  min-height: 50vh;
  width: 100%;
  top: 0;
  left: 0;

  &.upload-active {
    animation: activate-signup 1s ease forwards;
  }

  &.dbconnect-active {
    animation: activate-login 1s ease forwards;
  }

  h1 {
    font-weight: 700;
    width: 100%;
    color: white;
    font-size: 2rem;
  }

  p {
    width: 100%;
    color: white;
    font-size: 1.2rem;
  }

  span {
    font-size: 2rem;
    color: white;
    font-weight: bold;
  }
}

.action-content {
  max-width: 450px;
  height: auto;
}

@media screen and (max-width: 959px) {
  .action-container {
    min-height: 0;
  }
}
</style>
