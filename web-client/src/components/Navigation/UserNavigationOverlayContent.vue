<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="8" class="d-none d-sm-flex">
        <v-container fluid style="max-height: 37vh; overflow: auto">
          <v-row>
            <v-col cols="12" lg="6">
              <v-row>
                <v-col cols="12">
                  <network-nodes-list
                    :id="user.id"
                    edgeTypes="likes"
                    :show-counter="false"
                    full-width
                    :max-items="5"
                  >
                    <template #default="{ totalNetworkEntitiesCount }">
                      <custom-header
                        :class="{ 'mb-5': totalNetworkEntitiesCount }"
                      >
                        <span> Recent likes </span>
                        <template #info v-if="totalNetworkEntitiesCount > 0">
                          <entity-details-link
                            :id="user.id"
                            postfix="/activities"
                          >
                            view all {{ totalNetworkEntitiesCount }}
                          </entity-details-link>
                        </template>
                      </custom-header>
                    </template>
                  </network-nodes-list>
                </v-col>
              </v-row>
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
            <logout-button class="d-block" block />
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
import NoDataState from "@/components/Base/NoDataState";
import { useUser } from "@/composables/user";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import NetworkNodesList from "@/components/Base/NetworkNodesList";

export default {
  name: "UserNavigationOverlayContent",
  components: {
    NetworkNodesList,
    EntityAvatar,
    NoDataState,
    EntityMiniCard,
    CustomHeader,
    EntityDetailsLink,
    LogoutButton,
  },
  setup() {
    const { user, recentlyViewed } = useUser();
    return {
      user,
      recentlyViewed,
    };
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
