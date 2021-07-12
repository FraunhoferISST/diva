<template>
  <v-row>
    <v-col cols="12" v-if="metadata && metadata.length > 0">
      <expansion-panel :items-count="metadata.length">
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="2"
            v-for="(data, i) in metadata"
            :key="i"
          >
            <info-block :icon="data.icon">
              <info :info="{ name: data.title, value: data.value }" />
            </info-block>
          </v-col>
        </v-row>
      </expansion-panel>
    </v-col>
  </v-row>
</template>

<script>
import ExpansionPanel from "@/components/Base/ExpansionPanel";
import InfoBlock from "@/components/Base/InfoBlock2";
import Info from "@/components/Base/Info";

export default {
  name: "EntityGeneralMeta",
  components: {
    Info,
    InfoBlock,
    ExpansionPanel,
  },
  props: {
    metadata: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
