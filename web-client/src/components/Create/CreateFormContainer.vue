<template>
  <section class="create-form-container d-flex justify-center align-center">
    <v-container fluid>
      <div class="d-flex justify-center">
        <v-col class="create-form pa-0" cols="12" sm="12" md="12" lg="9" xl="7">
          <form class="create-form-content relative">
            <div class="create-form-forms pa-12">
              <slot></slot>
            </div>
            <div class="create-form-action">
              <colored-card
                :padding="false"
                :rounded="false"
                class="full-width fill-height"
              >
                <template slot="body">
                  <div
                    class="text-center fill-height d-flex column wrap justify-center align-center"
                  >
                    <div class="action-content pa-2 pa-md-10 flex-grow-1">
                      <div
                        class="mb-3 hidden-sm-and-down d-flex justify-center"
                      >
                        <slot name="title"> </slot>
                      </div>
                      <p
                        style="color: #dcdcdc"
                        class="create-form-hint hidden-sm-and-down"
                      >
                        <slot name="hint"></slot>
                      </p>
                      <div>
                        <slot name="import-button"></slot>
                      </div>
                    </div>
                  </div>
                </template>
              </colored-card>
            </div>
          </form>
        </v-col>
      </div>
    </v-container>
  </section>
</template>

<script>
import ColoredCard from "@/components/Base/ColoredCard";
export default {
  name: "CreateFormContainer",
  components: { ColoredCard },
};
</script>

<style scoped lang="scss">
.create-form {
  min-height: 60vh;
  overflow: hidden;
  position: relative;
  @include border-radius;
  background: white;
}
.create-form-content {
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 30%;
  grid-template-areas: "forms action";
}
.create-form-forms {
  grid-area: forms;
}
.create-form-action {
  grid-area: action;
}
.create-form-hint {
  color: white;
  font-size: 1.1rem;
}

@media screen and (max-width: 959px) {
  .create-form-content {
    grid-template-columns: unset;
    grid-template-areas:
      "forms"
      "action";
  }
  .create-form {
    min-height: unset;
  }
}
</style>
