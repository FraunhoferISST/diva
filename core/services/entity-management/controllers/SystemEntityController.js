const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const { logger } = require("@diva/common/logger");
const systemEntitiesService = require("../services/SystemEntitiesService");
const EntityController = require("./EntityController");

const reintializeJsonSchemaValidator = () =>
  systemEntitiesService
    .resolveEntitySchema()
    .then((resolvedSchema) => jsonSchemaValidator.init([resolvedSchema]))
    .catch((e) => {
      logger.error(`Couldn't reinitialize jsonSchemaValidator: ${e} `);
    });

class SystemEntitiesController extends EntityController {
  async create(req, res, next) {
    return super
      .create(req, res, next)
      .then(() => reintializeJsonSchemaValidator());
  }

  async deleteById(req, res, next) {
    return super
      .deleteById(req, res, next)
      .then(() => reintializeJsonSchemaValidator());
  }

  async getResolvedEntitySchema(req, res, next) {
    try {
      const resolvedSchema = await systemEntitiesService.resolveEntitySchema(
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
