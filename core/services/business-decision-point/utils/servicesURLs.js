const SERVICES_URLS =
  process.env.SERVICES_URLS || process.env.DIVA_HOST
    ? `entity-management::http://${process.env.DIVA_HOST}:3000,profiling-assistant::http://${process.env.DIVA_HOST}:3011`
    : "entity-management::http://localhost:3000,profiling-assistant::http://localhost:3011";

const servicesURLsMap = Object.fromEntries(
  SERVICES_URLS.split(",").map((dependencyGroup) => dependencyGroup.split("::"))
);

module.exports = servicesURLsMap;
