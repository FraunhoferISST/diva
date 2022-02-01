//Resources
import ResourceGeneral from "@/components/Resource/General/ResourceGeneral";
import ResourceDetails from "@/views/Resources/ResourceDetails";
import ResourceProfiling from "@/components/Resource/Profiling/ResourceProfiling";
import ResourceSample from "@/components/Resource/Sample/ResourceSample";
import ResourceIDS from "@/components/Resource/IDS/ResourceIDS";
//Assets
import AssetRelations from "@/components/Asset/AssetRelations/AssetRelations.vue";
import AssetsDetails from "@/views/Asset/AssetDetails.vue";
//Entity common views
import EntityCosts from "@/components/Entity/EntityCommonComponents/Costs/EntityCosts";
import EntityHistory from "@/components/Entity/EntityCommonComponents/History/EntityHistory";
import EntityReviews from "@/components/Entity/EntityCommonComponents/Reviews/EntityReviews";
import AssetGeneral from "@/components/Asset/AssetGeneral/AssetGeneral";

const ASSET_PREFIX = "asset";
const RESOURCE_PREFIX = "resource";

const entityCommonRoutes = (prefix) => [
  {
    path: "costs",
    name: `${prefix}_details_costs`,
    component: EntityCosts,
    props: true,
  },
  {
    path: "history",
    name: `${prefix}_details_history`,
    component: EntityHistory,
    props: true,
  },
  {
    path: "reviews",
    name: `${prefix}_details_reviews`,
    component: EntityReviews,
    props: true,
  },
];

const entityRoutesFactory = (entityType, prefix, startView, generalView) => {
  return {
    path: `${entityType}/:id`,
    name: entityType,
    component: startView,
    props: true,
    redirect: {
      name: `${prefix}_details_general`,
    },
    children: [
      {
        path: "general",
        name: `${prefix}_details_general`,
        component: generalView,
        props: true,
      },
      ...entityCommonRoutes(prefix),
    ],
  };
};

const resourceConfig = entityRoutesFactory(
  "resources",
  RESOURCE_PREFIX,
  ResourceDetails,
  ResourceGeneral
);
//Resource specific routes
resourceConfig.children.push(
  {
    path: "profiling",
    name: "resource_details_profiling",
    component: ResourceProfiling,
    props: true,
  },
  {
    path: "sample",
    name: "resource_details_sample",
    component: ResourceSample,
    props: true,
  },
  {
    path: "ids",
    name: "resource_details_ids",
    component: ResourceIDS,
    props: true,
  }
);

const assetConfig = entityRoutesFactory(
  "assets",
  ASSET_PREFIX,
  AssetsDetails,
  AssetGeneral
);
//Asset specific routes
assetConfig.children.push({
  path: "relations",
  name: "asset_details_relations",
  component: AssetRelations,
  props: true,
});

export default [resourceConfig, assetConfig];