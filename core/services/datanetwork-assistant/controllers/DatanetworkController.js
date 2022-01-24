const messageProducer = require("@diva/common/messaging/MessageProducer");
const DatanetworkService = require("../services/DatanetworkService");

class DatanetworkController {
  async getEdges(req, res, next) {
    try {
      const { from, types } = req.query;
      const result = await DatanetworkService.getEdges(
        {
          from,
          types: types ? types.split(",") : null,
        },
        req.query.bidirectional
      );
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getEdge(req, res, next) {
    try {
      const result = await DatanetworkService.getEdge(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async putEdge(req, res, next) {
    try {
      await DatanetworkService.createEdge(req.body);
      messageProducer.produce(
        req.body.from,
        req.headers["x-actorid"],
        "create",
        [req.body.from, req.body.to]
      );
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async deleteEdge(req, res, next) {
    try {
      await DatanetworkService.deleteEdge(req.body);
      messageProducer.produce(
        req.body.from,
        req.headers["x-actorid"],
        "delete",
        [req.body.to],
        {
          from: req.body.from,
          to: req.body.to,
          type: "delete",
          relationType: req.body.type,
          actorId: req.headers["x-actorid"],
        }
      );
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DatanetworkController();
