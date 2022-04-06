import apiFactory from "@/api/apiFactory";
import http from "@/api/http";
const axios = http.axios;
const systemEntitiesCollections = [
  "rules",
  "schemata",
  "policies",
  "asyncapis",
];
const config = Object.fromEntries(
  systemEntitiesCollections.map((type) => [type, apiFactory(`/${type}`)])
);
export default {
  ...config,
  schemata: {
    ...config.schemata,
    getScopedSchemata: (scope) => axios.post("/scopedSchemata", { scope }),
  },
};
