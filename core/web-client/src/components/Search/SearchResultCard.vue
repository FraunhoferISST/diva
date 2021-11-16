<template>
  <entity-details-link :id="doc.id" target="_blank">
    <div class="search-card-container fill-height d-flex">
      <div class="search-card">
        <div class="search-card-content">
          <div class="search-card-icon d-flex">
            <identicon
              class="card-icon mt-2"
              :hash="doc.uniqueFingerprint || doc.id"
              :options="{ size: 40 }"
            />
          </div>
          <div class="search-card-info-container">
            <h1 class="search-card-title">
              <span v-if="highlightedTitle" v-html="highlightedTitle"></span>
              <span v-else>{{ doc.title }}</span>
            </h1>
            <div class="search-card-meta-container mt-1">
              <div>
                <v-chip
                  v-if="doc.mimeType"
                  class="my-0 mr-2 font-weight-bold"
                  label
                  color="info"
                  x-small
                >
                  {{ mimeType }}
                </v-chip>
                <v-chip
                  v-if="doc.resourceType || doc.assetType"
                  class="my-0 mr-2 font-weight-bold"
                  label
                  color="info"
                  x-small
                  bold
                >
                  {{ doc.resourceType || doc.assetType }}
                </v-chip>
                <v-chip
                  class="my-0 font-weight-bold"
                  label
                  color="info"
                  x-small
                >
                  {{ doc.entityType }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <div class="search-card-keywords">
            <v-chip class="mr-1" x-small v-for="(tag, i) in keywords" :key="i">
              {{ tag }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>
  </entity-details-link>
</template>

<script>
import Identicon from "@/components/Base/Identicon";
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";

export default {
  name: "SearchResultCard",
  components: {
    EntityDetailsLink,
    Identicon,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mimeType() {
      const mimeType = this.doc.mimeType || this.doc.assetType;
      return mimeType.length > 30 ? `${mimeType.slice(0, 30)}...` : mimeType;
    },
    highlightedTitle() {
      return this.data?.highlight?.["title"]?.[0];
    },
    doc() {
      return this.data.doc;
    },
    keywords() {
      return (this.doc.keywords ?? []).slice(0, 25);
    },
  },
};
</script>

<style scoped lang="scss">
.status-tooltip {
  background-color: $bg_hover !important;
  opacity: 1;
  @include gradient-success;
  @include font-style(1.1rem, $font_body, bold, $bg_primary);
}
.search-card-container {
  width: 100%;
  // min-height: 117px;
  position: relative;
  transition: 0.5s;
  cursor: pointer;
  overflow: hidden;
  background-color: $bg_card;
  border-radius: 8px;
  &:hover {
    box-shadow: 0 0px 15px 10px rgba(black, 0.05);
  }
}

.search-card {
  transition: 0.3s;
  position: relative;
  padding: 10px;
  width: 100%;
  em {
    color: red;
  }
}

.search-card-content {
  display: grid;
  grid-template-columns: 45px 1fr;
  grid-gap: 10px;
  //max-height: 55px;
}

.search-card-info-container {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 4px;
}

.search-card-meta-container {
  display: grid;
  grid-template-columns: minmax(150px, auto) 1fr;
  grid-gap: 10px;
}

.search-card-title {
  // padding-right: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.05rem;
  @include font-style(1.1rem, $font_body, normal, $font_primary_color);
}

.search-card-icon {
  position: relative;

  img {
    max-width: 45px;
    width: 45px;
    max-height: 45px;
    height: 45px;
  }

  .card-icon {
    position: relative;
  }
}

.search-card-meta-header {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.2rem;
  @include font-style(0.7rem, $font_body, normal, $font_secondary_color);
}

.search-card-meta {
  color: $c_accent_primary;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8rem;

  &.type-label {
    display: inline-block;
    padding: 1px 3px;
    border-radius: 4px;
    @include font-style(0.8rem, $font_body, bold, $c_accent_success);
  }
}

.search-card-controls {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 36px;
  z-index: 2;
}

.search-card-keywords {
  white-space: normal;
  overflow: hidden;
  position: relative;
  max-height: 21px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: -2px;
    width: 80%;
    height: 100%;
    z-index: 2;
    background-image: linear-gradient(to right, transparent, $bg_card);
  }
}

@media screen and (max-width: 599px) {
  .search-card-title {
    @include font-style(1rem, $font_body, normal, $font_primary_color);
  }
}
</style>
