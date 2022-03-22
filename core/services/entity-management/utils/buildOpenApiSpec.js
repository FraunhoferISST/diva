const openApi = require("../apiDoc/openapiTemplate.json");
const openApiRoutes = require("../apiDoc/openapiRoutesTemplate.json");

const buildEntityPaths = (entity) =>
  JSON.parse(JSON.stringify(openApiRoutes).replace(/{collection}/g, entity));

/**
 * @param {String[]} entities - List of entities collections names
 */
module.exports = (entities) => {
  for (const entity of entities) {
    const { paths } = buildEntityPaths(entity);
    openApi.tags.push({
      name: entity,
      description: `CRUD operations for the ${entity}`,
    });
    openApi.paths = {
      ...openApi.paths,
      ...paths,
    };
  }
  return openApi;
};
