<template>
  <entity-details-link :id="data.id">
    <div class="search-card-container">
      <div class="search-card">
        <div class="search-card-header">
          <div class="search-card-icon">
            <identicon
              class="card-icon"
              :hash="data.resourceHash || data.id"
              :options="{ size: 30 }"
            />
          </div>
          <div class="search-card-info-container">
            <h1 class="search-card-title">Hui {{ data.title || data.name }}</h1>
            <div class="search-card-meta-container">
              <div>
                <v-chip class="my-0" label color="info" outlined small bold>
                  {{ data.mimeType || "Asset" }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
        <div class="search-card-keywords mt-2">
          <div class="search-card-keywords">
            <v-chip small v-for="(tag, i) in data.tags" :key="i">
              {{ tag }}</v-chip
            >
          </div>
        </div>
      </div>
    </div>
  </entity-details-link>
</template>

<script>
import Identicon from "@/components/Base/Identicon";
import vars from "@/styles/vars.scss";
import EntityDetailsLink from "../Entity/EntityDetailsLink";

export default {
  name: "SearchResultList",
  components: {
    EntityDetailsLink,
    Identicon,
  },
  data: () => ({
    fake_status: true,
    color: {
      gradient: {
        radial: false,
        direction: "",
        colors: [
          {
            color: vars.accentPrimary,
            offset: "0",
            opacity: "0.6",
          },
          {
            color: vars.accentSecondary,
            offset: "100",
            opacity: "0.4",
          },
        ],
      },
    },
  }),
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {
    globalColors() {
      return vars;
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
  position: relative;
  transition: 0.5s;
  cursor: pointer;
  overflow: hidden;
  background-color: $bg_card;
  border-bottom: 2px solid $bg_primary;
  &:hover {
    box-shadow: 0 0 15px 10px rgba(black, 0.05);
  }
}

.search-card {
  transition: 0.3s;
  position: relative;
  padding: 10px;
  width: 100%;
}

.search-card-header {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 10px;
  max-height: 55px;
}

.search-card-info-container {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 4px;
}

.search-card-meta-container {
  display: grid;
  grid-template-columns: minmax(130px, auto) 1fr;
  grid-gap: 10px;
}

.search-card-title {
  padding-right: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.05rem;
  @include font-style(1.1rem, $font_body, normal, $font_primary_color);
}

.search-card-icon {
  max-width: 60px;
  width: 60px;
  max-height: 60px;
  height: 60px;
  padding: 18px;
  //height: 100px;
  position: relative;

  .card-icon {
    position: relative;
  }
}

.search-card-quality {
  position: absolute;
  top: 0;
  left: 0;

  &:after {
    content: "";
    display: block;
    position: absolute;
    height: 48%;
    bottom: 0;
    width: 100%;
    z-index: 0;
    background-color: $bg_card;
  }
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
  //white-space: nowrap;
  overflow: hidden;
  position: relative;
  max-height: 35px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: -2px;
    width: 25%;
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
