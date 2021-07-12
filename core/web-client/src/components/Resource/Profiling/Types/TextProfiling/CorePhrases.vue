<template>
  <v-expansion-panels id="sentences-panel">
    <v-expansion-panel
      class="elevation-0"
      v-for="(item, i) in phrases"
      :key="i"
    >
      <v-expansion-panel-header>
        <div class="expand-header">
          Sentences provided by <b class="ml-2">{{ item.algorithm }}</b>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card color="transparent" flat tile>
          <v-window v-model="current">
            <v-window-item v-for="(sentence, i) in item.sentences" :key="i">
              <v-container>
                <v-row>
                  <v-col>
                    <p class="sentence">&laquo; {{ sentence }} &raquo;</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>

          <v-card-actions class="justify-space-between">
            <v-btn icon text color="primary" @click="prev">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-item-group v-model="current" class="text-center" mandatory>
              <v-item
                v-for="(sentence, i) in item.sentences"
                :key="i"
                v-slot:default="{ active, toggle }"
              >
                <v-btn
                  :input-value="active"
                  icon
                  small
                  color="blue"
                  text
                  @click="toggle"
                >
                  <v-icon small color="blue lighten-3"
                    >fiber_manual_record</v-icon
                  >
                </v-btn>
              </v-item>
            </v-item-group>
            <v-btn icon text color="primary" @click="next">
              <v-icon>chevron_right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "CorePhrases",
  props: {
    phrases: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    length: 3,
    current: 0,
  }),

  methods: {
    next() {
      this.current = this.current + 1 === length ? 0 : this.current + 1;
    },
    prev() {
      this.current = this.current - 1 < 0 ? this.length - 1 : this.current - 1;
    },
  },
};
</script>

<style scoped lang="scss">
.sentence {
  @include font-style(0.9rem, $font_header, bold, gray);
  transition: 0.3s;
  display: block;
  padding: 10px;
  border-radius: 4px;
  width: 100%;

  position: relative;
}

.expand-header {
  letter-spacing: 0.01rem;
  @include font-style(0.9rem, $font_header, normal, black);
}

#sentences-panel .v-expansion-panel__container {
  background-color: $bg_card;
  border-top: 1px solid $bg_primary;
}
</style>
