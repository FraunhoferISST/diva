<template>
  <div class="general-recommendations">
    <card header="Maybe also interesting for you">
      <v-sheet slot="body" color="transparent" class="mx-auto">
        <v-slide-group show-arrows>
          <v-slide-item class="ma-3" v-for="(item, i) in items" :key="i">
            <entity-details-link
              target="_blank"
              :id="item.id"
              :title="item.title || item.name"
            >
              <card hover>
                <div slot="body" class="recommendation-card text-center">
                  <div class="recommendation-card-icon">
                    <v-avatar size="40px" :tile="true">
                      <identicon :hash="item.resourceHash || item.id" />
                    </v-avatar>
                  </div>
                  <div class="recommendation-card-title mt-3">
                    <h5 class="text-truncate">
                      {{ item.title || item.name || item.filename }}
                    </h5>
                  </div>
                </div>
              </card>
            </entity-details-link>
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
    </card>
  </div>
</template>

<script>
import Identicon from "@/components/Base/Identicon";
import Card from "@/components/Base/Card";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";

export default {
  name: "GeneralRecommendation",
  components: { EntityDetailsLink, Card, Identicon },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [
        {
          id: "resource:uuid:c718f24e-3799-4957-96a8-cd708d1c230e",
          title: null,
          name: "kek.csv",
          resourceHash:
            "eaadc2866dd4381b421411e55dae9d645fa698a0b29b08712b4e44c793f7e6a9",
          keywords: null,
          typeGroup: null,
          mimeType: "text/csv",
          __typename: "SearchResult",
        },
        {
          id: "resource:uuid:510a1abe-d225-4034-b9f2-a9c9057d7bc0",
          title: "Looooooooooooooong title klasd lasjdl jalsdj laksjdl ajsld",
          name: "people.csv",
          resourceHash:
            "5ef840979f5f2c0b2c7283a678e70ffddbd1e6d9dcf66ec7b2d2d1ab787ab83f",
          keywords: null,
          typeGroup: null,
          mimeType: "text/csv",
          __typename: "SearchResult",
        },
        {
          id: "resource:uuid:63c1126d-9df7-4ae6-9c16-24a16b5390da",
          title: null,
          name: "lymph.csv",
          resourceHash:
            "b25965735b4a795c9f92993e8c0f3a37dfccff827845714842457eca7f02bd08",
          keywords: null,
          typeGroup: null,
          mimeType: "text/csv",
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:f9323a2e-9a8f-441b-a349-9ef439de4a84",
          title: null,
          name: "My new Asset2",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:5bdccca7-4cc3-43fa-9e47-a054de2e2a60",
          title: null,
          name: "My new Asset3",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:f8343425-d3de-465d-80bb-bea81da171f7",
          title: null,
          name: "My new Asset",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:d469fd75-63ea-4aa6-977e-09d9fb2bb906",
          title: null,
          name: "My new Asset4",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:2b3a4373-996a-43e1-b1b3-3e43fc170edc",
          title: null,
          name: "My new Asset5",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "resource:uuid:c718f24e-3799-4957-96a8-cd708d1c230e",
          title: null,
          name: "kek.csv",
          resourceHash:
            "eaadc2866dd4381b421411e55dae9d645fa698a0b29b08712b4e44c793f7e6a9",
          keywords: null,
          typeGroup: null,
          mimeType: "text/csv",
          __typename: "SearchResult",
        },
        {
          id: "resource:uuid:510a1abe-d225-4034-b9f2-a9c9057d7bc0",
          title: "Looooooooooooooong title klasd lasjdl jalsdj laksjdl ajsld",
          name: "people.csv",
          resourceHash:
            "5ef840979f5f2c0b2c7283a678e70ffddbd1e6d9dcf66ec7b2d2d1ab787ab83f",
          keywords: null,
          typeGroup: null,
          mimeType: "text/csv",
          __typename: "SearchResult",
        },
        {
          id: "resource:uuid:63c1126d-9df7-4ae6-9c16-24a16b5390da",
          title: null,
          name: "lymph.csv",
          resourceHash:
            "b25965735b4a795c9f92993e8c0f3a37dfccff827845714842457eca7f02bd08",
          keywords: null,
          typeGroup: null,
          mimeType: "text/csv",
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:f9323a2e-9a8f-441b-a349-9ef439de4a84",
          title: null,
          name: "My new Asset2",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:5bdccca7-4cc3-43fa-9e47-a054de2e2a60",
          title: null,
          name: "My new Asset3",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:f8343425-d3de-465d-80bb-bea81da171f7",
          title: null,
          name: "My new Asset",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:d469fd75-63ea-4aa6-977e-09d9fb2bb906",
          title: null,
          name: "My new Asset4",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
        {
          id: "asset:uuid:2b3a4373-996a-43e1-b1b3-3e43fc170edc",
          title: null,
          name: "My new Asset5",
          resourceHash: null,
          keywords: null,
          typeGroup: null,
          mimeType: null,
          __typename: "SearchResult",
        },
      ],
    },
  },
};
</script>
<style scoped lang="scss">
.recommendation-card {
  width: 100px;
}
.recommendation-card-title {
  transition: 0.3s;
  &:hover {
    color: $font_link_color_hover;
  }
}
</style>
