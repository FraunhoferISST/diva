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
  async getByScope(req, res, next) {
    try {
      const result = await this.service.getByScope(req.body);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

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
}

module.exports = new SchemataController(schemataService);
