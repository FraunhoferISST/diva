//Resources
import ResourceProfiling from "@/components/Resource/Profiling/ResourceProfiling";
import ResourceSample from "@/components/Resource/Sample/ResourceSample";
//Assets
import AssetEntities from "@/components/Asset/AssetEntities.vue";
//Users
import UserGeneral from "@/components/User/UserGeneral/";
import UserActivities from "@/components/User/UserActivities/";
//Entity common views
import EntityCosts from "@/components/Entity/EntityCommonComponents/Costs/EntityCosts";
import EntityHistory from "@/components/Entity/EntityCommonComponents/History/EntityHistory";
import EntityReviews from "@/components/Entity/EntityCommonComponents/Reviews/EntityReviews";
import EntityDetails from "@/views/EntityDetails";
import EntityGeneral from "@/components/Entity/EntityCommonComponents/General/EntityGeneral";
import EntityDataNetwork from "@/components/DataNetwork/EntityDataNetwork";

import defaultEntityDetailsRoutes from "@/utils/defaultEntityDetailsRoutes";

const generateDefaultEntityDetailsRoutes = (prefix = "entity", filterBy = []) =>
  defaultEntityDetailsRoutes
    .map(({ name, ...rest }) => ({
      ...rest,
      name: `${name.replace("entity", prefix)}`,
    }))
    .filter(({ title }) => !filterBy.includes(title));

const RESOURCE_PREFIX = "resource";
const ASSET_PREFIX = "asset";
const USER_PREFIX = "user";
const DESTROYCLAIM_PREFIX = "destroyclaim";
const ENTITY_PREFIX = "entity";

const entityCommonRoutes = (prefix = ENTITY_PREFIX) => [
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
  {
    path: "datanetwork",
    name: `${prefix}_details_datanetwork`,
    component: EntityDataNetwork,
    props: true,
  },
];

const entityRoutesFactory = ({
  collection = "entities",
  prefix = ENTITY_PREFIX,
  startView = EntityDetails,
  generalView = EntityGeneral,
  routes = defaultEntityDetailsRoutes,
} = {}) => {
  return {
    path: `${collection}/:id`,
    name: collection,
    component: startView,
    props: (route) => ({
      id: route.params.id,
      routes,
    }),
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

const resourceConfig = entityRoutesFactory({
  collection: "resources",
  prefix: RESOURCE_PREFIX,
  routes: [
    ...generateDefaultEntityDetailsRoutes(RESOURCE_PREFIX),
    {
      title: "Costs",
      icon: "attach_money",
      name: "resource_details_costs",
    },
    {
      title: "Profiling",
      icon: "developer_board",
      name: "resource_details_profiling",
    },
    {
      title: "Sample",
      icon: "description",
      name: "resource_details_sample",
    },
  ],
});
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
  }
);

const assetConfig = entityRoutesFactory({
  collection: "assets",
  prefix: ASSET_PREFIX,
  routes: [
    ...generateDefaultEntityDetailsRoutes(ASSET_PREFIX),
    {
      title: "Costs",
      icon: "attach_money",
      name: "asset_details_costs",
    },
    {
      title: "Entities",
      icon: "topic",
      name: "asset_details_entities",
    },
  ],
});
//Asset specific routes
assetConfig.children.push({
  path: "entities",
  name: "asset_details_entities",
  component: AssetEntities,
  props: true,
});

const usersConfig = entityRoutesFactory({
  collection: "users",
  prefix: USER_PREFIX,
  generalView: UserGeneral,
  routes: [
    ...generateDefaultEntityDetailsRoutes(USER_PREFIX, ["Reviews"]),
    {
      title: "Activities",
      icon: "bolt",
      name: "user_details_activities",
    },
  ],
});
//User specific routes
usersConfig.children.push({
  path: "activities",
  name: "user_details_activities",
  component: UserActivities,
  props: true,
});

const destroyclaimConfig = entityRoutesFactory({
  collection: "destroyclaims",
  prefix: DESTROYCLAIM_PREFIX,
  routes: [
    ...generateDefaultEntityDetailsRoutes(DESTROYCLAIM_PREFIX),
    {
      title: "Claim Model",
      icon: "delete",
      name: "destroyclaim_details_model",
    },
  ],
});
//Destroyclaim specific routes
destroyclaimConfig.children.push({
  path: "model",
  name: "destroyclaim_details_model",
  component: AssetEntities,
  props: true,
});

const entityConfig = entityRoutesFactory();
export default [
  resourceConfig,
  assetConfig,
  usersConfig,
  destroyclaimConfig,
  entityConfig,
];
