const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const { logger } = require("@diva/common/logger");
const schemataService = require("../services/SchemataService");
const EntityController = require("./EntityController");

const reintializeJsonSchemaValidator = () =>
  schemataService
    .resolveEntitySchema()
    .then((resolvedSchema) => jsonSchemaValidator.init([resolvedSchema]))
    .catch((e) => {
      logger.error(`Couldn't reinitialize jsonSchemaValidator: ${e} `);
    });

class SchemataController extends EntityController {
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
      const resolvedSchema = await schemataService.resolveEntitySchema(
        req.params.name
      );
      res.status(200).send(resolvedSchema);
    } catch (err) {
      return next(err);
    }
  }

  async getByName(req, res, next) {
    try {
      const specEntity = await schemataService.getSchemaByName(req.params.name);
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(specEntity.schema);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new SchemataController(schemataService);
