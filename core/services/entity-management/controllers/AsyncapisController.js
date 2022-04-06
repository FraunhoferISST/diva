const asyncapisService = require("../services/AsyncapisService");
const EntityController = require("./EntityController");

class AsyncapisController extends EntityController {
  async getByName(req, res, next) {
    try {
      const specEntity = await asyncapisService.getByName(req.params.name);
      res.setHeader("Content-Type", "text/yaml");
      res.status(200).send(specEntity.asyncapi);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AsyncapisController(asyncapisService);
