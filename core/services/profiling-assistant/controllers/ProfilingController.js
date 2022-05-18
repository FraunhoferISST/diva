const profilingService = require("../services/ProfilingService");

class ProfilingController {
  async runProfiling(req, res, next) {
    try {
      const result = await profilingService.run(
        req.body.entityId,
        req.headers.diva.actorId
      );
      res.status(200).json(result.data);
    } catch (e) {
      next(e);
    }
  }

  async runDag(req, res, next) {
    try {
      const { dag } = req.params;
      const { body } = req;
      const result = await profilingService.runDag(
        dag,
        body,
        req.headers.diva.actorId
      );
      res.status(200).json(result.data);
    } catch (e) {
      next(e);
    }
  }

  async existProfiling(req, res, next) {
    try {
      const result = await profilingService.exists(req.body.entityId);
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProfilingController();
