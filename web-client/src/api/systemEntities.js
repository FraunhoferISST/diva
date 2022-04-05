import apiFactory from "@/api/apiFactory";
const systemEntitiesCollections = [
  "rules",
  "schemata",
  "policies",
  "asyncapis",
];
export default {
  ...Object.fromEntries(
    systemEntitiesCollections.map((type) => [type, apiFactory(`/${type}`)])
  ),
};
