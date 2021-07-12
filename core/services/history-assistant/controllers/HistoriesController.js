const historiesService = require("../services/HistoriesService");

class HistoriesController {
  async getHistories(req, res, next) {
    try {
      const result = await historiesService.getHistories(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getHistory(req, res, next) {
    try {
      const result = await historiesService.getHistoryById(
        req.params.id,
        req.query
      );
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new HistoriesController();
