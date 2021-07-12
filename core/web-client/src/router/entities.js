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

const trackAccess = (to, from, next) => {
  /*const TRACK_ACCESS_EVENT = "trackAccess";
  const id = to.params.id;
  if (id) {
    if (socketioEndpoint.disconnected) {
      socketioEndpoint.open();
    }
    socketioEndpoint.emit(TRACK_ACCESS_EVENT, id);
  }*/
  next();
};
const ASSET_PREFIX = "asset";
const RESOURCE_PREFIX = "resource";

const entityTypeMap = {
  asset: {
    route: "assets",
    prefix: ASSET_PREFIX,
    routeName: `${ASSET_PREFIX}_details`,
    startView: AssetsDetails,
    generalView: AssetGeneral,
    redirect: `${ASSET_PREFIX}_details_general`,
  },
  resource: {
    route: "resources",
    prefix: RESOURCE_PREFIX,
    routeName: `${RESOURCE_PREFIX}_details`,
    startView: ResourceDetails,
    generalView: ResourceGeneral,
    redirect: `${RESOURCE_PREFIX}_details_general`,
  },
};

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

const entityRoutesBuilder = (entityType) => {
  const {
    route,
    routeName,
    startView,
    generalView,
    redirect,
    prefix,
  } = entityTypeMap[entityType];

  return {
    path: `${route}/:id`,
    name: routeName,
    component: startView,
    beforeEnter: trackAccess,
    props: true,
    redirect: {
      name: redirect,
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

const resourceConfig = entityRoutesBuilder("resource");
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

const assetConfig = entityRoutesBuilder("asset");
//Asset specific routes
assetConfig.children.push({
  path: "relations",
  name: "asset_details_relations",
  component: AssetRelations,
  props: true,
});

export default [resourceConfig, assetConfig];
