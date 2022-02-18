const DEPENDENCY_URLS =
  process.env.DEPENDENCY_URLS ||
  "datanetwork-assistant::http://localhost:3012,entity-management::http://localhost:3000";

const dependencyURLsMap = Object.fromEntries(
  DEPENDENCY_URLS.split(",").map((dependencyGroup) =>
    dependencyGroup.split("::")
  )
);

module.exports = dependencyURLsMap;
