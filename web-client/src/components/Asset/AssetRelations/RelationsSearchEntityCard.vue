<template>
  <div class="asset-entity-card text-center">
    <div class="asset-entity-card-details">
      <colored-card>
        <div slot="body" class="d-flex justify-space-between column">
          <div>type</div>
        </div>
      </colored-card>
    </div>
    <div class="asset-entity-card-overview text-center">
      <div class="mt-0">
        <entity-avatar
          :entity-id="entity.id"
          :image-id="entity.entityIcon"
          :entity-title="entity.title || entity.username"
        />
        <div class="d-flex align-center text-truncate">
          <h4 class="asset-entity-card-title text-truncate">
            <entity-details-link
              :id="entity.id"
              class="text-truncate"
              target="_blank"
            >
              {{ entity.title || entity.username }}
            </entity-details-link>
          </h4>
        </div>
      </div>
    </div>
    <div>
      <!--<v-btn icon flat color="error" @click="emitRemove">
        <v-icon color="error">
          close
        </v-icon>
      </v-btn>-->
    </div>
  </div>
</template>

<script>
import ColoredCard from "@/components/Base/ColoredCard";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import EntityAvatar from "@/components/Entity/EntityAvatar";
export default {
  name: "RelationsSearchEntityCard",
  components: { EntityAvatar, EntityDetailsLink, ColoredCard },
  data: () => ({
    selected: [],
  }),
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  methods: {
    emitRemove() {
      this.$emit("remove", this.entity.resourceHash);
    },
  },
};
</script>

<style scoped lang="scss">
.asset-entity-card {
  width: 100px;
  // border: 2px solid gray;
  padding: 10px;
  display: inline-block;
  position: relative;
  @include border-radius();
  transition: 0.3s;
  /*&:hover {
    !*background-color: white;
    box-shadow: 0 0 20px 5px rgba(black, 0.1);*!
    & .asset-entity-card-details {
      opacity: 1;
    }
    & .asset-entity-card-title a {
      color: white;
    }
  }*/
}
.asset-entity-card-details {
  transition: 0.3s;
  opacity: 0;
  position: absolute;
  top: -30px;
  left: -25px;
  width: 150px;
  height: 150px;
  & .colored-card {
    height: 100%;
  }
}
.asset-entity-card-overview {
  //width: 100px;
  position: relative;
  z-index: 100;
}
</style>
