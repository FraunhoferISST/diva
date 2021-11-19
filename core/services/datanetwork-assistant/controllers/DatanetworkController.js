const DatanetworkService = require("../services/DatanetworkService");

class DatanetworkController {
  async getEdges(req, res, next) {
    try {
      const result = await DatanetworkService.getEdges(
        req.params.id,
        req.headers["x-actorid"]
      );
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async putEdge(req, res, next) {
    try {
      await DatanetworkService.putEdge(req.body, req.headers["x-actorid"]);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async deleteEdge(req, res, next) {
    try {
      await DatanetworkService.deleteEdge(req.body, req.headers["x-actorid"]);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DatanetworkController();
