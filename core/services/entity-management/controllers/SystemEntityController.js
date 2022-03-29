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
}

module.exports = new SystemEntitiesController(systemEntitiesService);
