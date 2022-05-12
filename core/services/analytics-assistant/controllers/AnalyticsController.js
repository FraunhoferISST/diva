const analyticsService = require("../services/AnalyticsService");

class AnalyticsController {
  async entityDistribution(req, res, next) {
    try {
      const result = await analyticsService.entityDistribution();
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  // TODO/IDEA: aggregate entities by create/modified

  async resourceTypeDistribution(req, res, next) {
    try {
      const result = await analyticsService.resourceTypeDistribution();
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async resourceMimeTypeDistribution(req, res, next) {
    try {
      const result = await analyticsService.resourceMimeTypeDistribution();
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getReviewsStats(req, res, next) {
    try {
      const { id } = req.params;
      const result = await analyticsService.getReviewsStats(id);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AnalyticsController();
