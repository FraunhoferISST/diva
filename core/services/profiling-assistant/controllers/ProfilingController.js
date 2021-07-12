const ProfilingService = require("../services/ProfilingService");

class ProfilingController {
  async runProfiling(req, res, next) {
    try {
      const result = await ProfilingService.run(
        req.body.resourceId,
        req.actorid
      );
      res.status(200).json(result.data);
    } catch (e) {
      next(e);
    }
  }

  async existProfiling(req, res, next) {
    try {
      const result = await ProfilingService.exists(req.body.resourceId);
      res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProfilingController();
