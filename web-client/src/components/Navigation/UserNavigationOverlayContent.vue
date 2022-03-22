<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="8" class="d-none d-sm-flex">
        <v-container fluid style="max-height: 37vh; overflow: auto">
          <v-row>
            <v-col cols="12" lg="6">
              <data-fetcher :fetch-method="fetchRecentLikes">
                <v-row>
                  <v-col cols="12">
                    <custom-header text="Recent likes">
                      <span> Recent likes </span>
                      <template #info v-if="recentLikes.length > 0">
                        <entity-details-link :id="user.id">
                          view all
                        </entity-details-link>
                      </template>
                    </custom-header>
                  </v-col>
                  <v-col cols="12">
                    <v-row dense v-if="recentLikes.length > 0">
                      <v-col
                        cols="12"
                        v-for="entity in recentLikes"
                        :key="entity.id"
                      >
                        <entity-mini-card :entity="entity" />
                      </v-col>
                    </v-row>
                    <no-data-state v-else text="No likes sofar" />
                  </v-col>
                </v-row>
              </data-fetcher>
            </v-col>
            <v-col cols="12" lg="6">
              <v-row>
                <v-col cols="12">
                  <custom-header>
                    <span> Recently viewed </span>
                    <template #info v-if="recentlyViewed.length > 0">
                      <entity-details-link :id="user.id">
                        view all
                      </entity-details-link>
                    </template>
                  </custom-header>
                </v-col>
                <v-col cols="12">
                  <v-row dense v-if="recentlyViewed.length > 0">
                    <v-col
                      cols="12"
                      v-for="entity in recentlyViewed"
                      :key="entity.id"
                    >
                      <entity-mini-card :entity="entity" />
                    </v-col>
                  </v-row>
                  <no-data-state v-else text="Nothing to show" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" sm="4">
        <v-row dense>
          <v-col cols="12">
            <div class="user-controls">
              <entity-avatar
                size="80px"
                :image-id="user.entityIcon"
                :entity-id="user.id"
                :entity-title="user.username"
              />
              <div class="d-flex align-center">
                <p class="ma-0">
                  <entity-details-link :id="user.id">
                    {{ user.username }}
                  </entity-details-link>
                  <br />
                  <span>
                    {{ user.email }}
                  </span>
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" class="mt-4">
            <logout-button block />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LogoutButton from "./LogoutButton";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import CustomHeader from "@/components/Base/CustomHeader";
import EntityMiniCard from "@/components/Entity/EntityMiniCard";
import DataFetcher from "@/components/DataFetchers/DataFetcher";
import NoDataState from "@/components/Base/NoDataState";
import { useUser } from "@/composables/user";
import EntityAvatar from "@/components/Entity/EntityAvatar";

export default {
  name: "UserNavigationOverlayContent",
  components: {
    EntityAvatar,
    NoDataState,
    DataFetcher,
    EntityMiniCard,
    CustomHeader,
    EntityDetailsLink,
    LogoutButton,
  },
  setup() {
    const { user } = useUser();
    return {
      user,
    };
  },
  data: () => ({
    recentLikes: [],
  }),
  computed: {
    recentlyViewed() {
      return this.user.recentlyViewed ?? [];
    },
  },
  methods: {
    fetchRecentLikes() {
      return this.$api.datanetwork
        .getEdges({
          from: this.user.id,
          edgeTypes: "likes",
        })
        .then(async ({ data: { collection } }) =>
          Promise.all(
            collection.map((edge) => {
              const entityType = edge.to.entityId.slice(
                0,
                edge.to.entityId.indexOf(":")
              );
              return this.$api[`${entityType}s`]
                .getByIdIfExists(edge.to.entityId, {
                  fields:
                    "id, title, entityType, username, mimeType, entityIcon",
                })
                .then(({ data }) => data)
                .catch(() => {
                  /*just ignore it*/
                });
            })
          )
        )
        .then((recentLikes) => (this.recentLikes = recentLikes));
    },
  },
};
</script>

<style scoped lang="scss">
.user-controls {
  display: grid;
  grid-template-columns: 80px 1fr;
  column-gap: 16px;
}
</style>
