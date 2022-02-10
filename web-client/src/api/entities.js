import apiFactory from "@/api/apiFactory";
const entityTypes = ["resource", "asset", "user", "review", "service"];
export default {
  ...Object.fromEntries(
    entityTypes.map((type) => [`${type}s`, apiFactory(`/${type}s/`)])
  ),
};
