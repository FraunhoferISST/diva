import pluralize from "pluralize";
import apiFactory from "@/api/apiFactory";
const entityTypes = ["rule", "schema", "policy"];
export default {
  ...Object.fromEntries(
    entityTypes.map((type) => [pluralize(type), apiFactory("/systemEntities")])
  ),
};
