<template>
  <entity-details-link :id="doc.id" target="_blank">
    <div class="search-card-container fill-height d-flex py-8 pa-3 pa-md-10">
      <div class="search-card">
        <div class="search-card-header">
          <div class="search-card-icon d-flex">
            <entity-avatar
              :size="40"
              :entity-id="doc.id || ''"
              :image-id="doc.entityIcon || ''"
              :entity-title="doc.title || doc.username || 'Some entity'"
            />
          </div>
          <div class="search-card-info-container">
            <h1 class="search-card-title">
              <span v-if="highlightedTitle" v-html="highlightedTitle"></span>
              <span v-else>{{
                doc.title || doc.username || "Some entity"
              }}</span>
            </h1>
            <div class="search-card-meta-container mt-1">
              <div>
                <v-chip
                  class="my-0 mr-2 font-weight-bold"
                  label
                  color="#eff3f7"
                  x-small
                  v-for="label in labels"
                  :key="label"
                >
                  {{ label }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
        <div class="search-card-content">
          <div class="search-card-keywords mt-4" v-if="keywords.length > 0">
            <v-chip class="mr-1" x-small v-for="(tag, i) in keywords" :key="i">
              {{ tag }}
            </v-chip>
          </div>
          <markdown-viewer
            class="search-card-description ma-0 mt-2"
            v-if="doc.description"
            :markdown="description"
          />
          <v-container fluid class="pa-0 mt-4">
            <v-row dense>
              <v-col cols="12" sm="6" lg="3">
                <div class="search-card-timestamps d-flex">
                  <info-block-title>Created</info-block-title>
                  <info-block-value>
                    <date-display :date="doc.createdAt" />
                  </info-block-value>
                </div>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <div class="search-card-timestamps d-flex">
                  <info-block-title>Modified</info-block-title>
                  <info-block-value>
                    <date-display :date="doc.modifiedAt" />
                  </info-block-value>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </div>
  </entity-details-link>
</template>

<script>
import EntityDetailsLink from "@/components/Entity/EntityDetailsLink";
import InfoBlockTitle from "@/components/Base/InfoBlock/InfoBlockTitle";
import InfoBlockValue from "@/components/Base/InfoBlock/InfoBlockValue";
import DateDisplay from "@/components/Base/DateDisplay";
import EntityAvatar from "@/components/Entity/EntityAvatar";
import MarkdownViewer from "@/components/Base/MarkdownViewer";

export default {
  name: "SearchResultCard",
  components: {
    MarkdownViewer,
    EntityAvatar,
    DateDisplay,
    InfoBlockValue,
    InfoBlockTitle,
    EntityDetailsLink,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    highlightedTitle() {
      return (
        this.data?.highlight?.["title"]?.[0] ||
        this.data?.highlight?.["username"]?.[0]
      );
    },
    doc() {
      return this.data.doc;
    },
    labels() {
      return [
        this.doc.entityType,
        this.doc.resourceType,
        this.doc.assetType,
        this.doc.mimeType,
      ]
        .filter((label) => label)
        .map((label) =>
          label.length > 30 ? `${label.slice(0, 30)}...` : label
        );
    },
    description() {
      const desc = this.doc.description ?? "";
      return desc.length > 250 ? `${desc.slice(0, 250)}... ` : desc;
    },
    keywords() {
      return (this.doc.keywords ?? []).slice(0, 25);
    },
  },
};
</script>

<style scoped lang="scss">
.search-card-container {
  width: 100%;
  position: relative;
  transition: 0.5s;
  cursor: pointer;
  overflow: hidden;
  //border-bottom: 2px solid $bg-card_secondary;
  &:hover {
    background-color: #f8f8f8;
  }
}

.search-card {
  transition: 0.3s;
  position: relative;
  width: 100%;
}

.search-card-header {
  display: grid;
  grid-template-columns: 45px 1fr;
  grid-gap: 10px;
}

.search-card-info-container {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 4px;
}

.search-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.02rem;
  @include font-style(1.2rem, $font_header, normal, $font_primary_color);
}

.search-card-description {
  @include font-style(1rem, $font_body, normal, $font_secondary_color);
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

.search-card-content {
  padding-left: 60px;
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
    z-index: 1;
    background-image: linear-gradient(to right, transparent, $bg_card);
  }
}

.search-card-timestamps {
  gap: 10px;
}

@media screen and (max-width: 599px) {
  .search-card-title {
    @include font-style(1rem, $font_body, normal, $font_primary_color);
  }
}
</style>
