const SERVICES_URLS =
  process.env.SERVICES_URLS ||
  "datanetwork-assistant::http://localhost:3012,entity-management::http://localhost:3000,profiling-assistant::http://localhost:3011";

const servicesURLsMap = Object.fromEntries(
  SERVICES_URLS.split(",").map((dependencyGroup) => dependencyGroup.split("::"))
);

module.exports = servicesURLsMap;
