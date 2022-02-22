const profilingService = require("../services/ProfilingService");

class ProfilingController {
  async runProfiling(req, res, next) {
    try {
      const result = await profilingService.run(
        req.body.entityId,
        req.headers["x-actorid"]
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
