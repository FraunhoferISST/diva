const systemEntitiesService = require("../services/SystemEntitiesService");
const EntityController = require("./EntityController");

class SystemEntitiesController extends EntityController {
  async resolveSchemaByName(req, res, next) {
    try {
      const resolvedSchema = await systemEntitiesService.resolveSchemaByName(
        req.params.name
      );
      res.status(200).send(resolvedSchema);
    } catch (err) {
      return next(err);
    }
  }

  async getSpecificationEntityByName(req, res, next) {
    try {
      const specEntity = await systemEntitiesService.getEntityByName(
        req.params.name
      );
      res.setHeader(
        "Content-Type",
        specEntity.asyncapi ? "text/yaml" : "text/plain"
      );
      res.status(200).send(specEntity.schema ?? specEntity.asyncapi);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new SystemEntitiesController(systemEntitiesService);
