const historiesService = require("../services/HistoriesService");

class HistoriesController {
  async getHistories(req, res, next) {
    try {
      const result = await historiesService.get(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getHistory(req, res, next) {
    try {
      const result = await historiesService.getById(req.params.id, req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new HistoriesController();
