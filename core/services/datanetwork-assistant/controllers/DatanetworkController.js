const messageProducer = require("@diva/common/messaging/MessageProducer");
const DatanetworkService = require("../services/DatanetworkService");
const datanetworkService = require("../services/DatanetworkService");

class DatanetworkController {
  async getEdges(req, res, next) {
    try {
      const { from, edgeTypes } = req.query;
      const result = await DatanetworkService.getEdges(
        {
          from,
          edgeTypes: edgeTypes ? edgeTypes.split(",") : null,
        },
        req.query.bidirectional
      );
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getEdgeById(req, res, next) {
    try {
      const result = await DatanetworkService.getEdgeById(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async putEdge(req, res, next) {
    try {
      const newEdgeId = await DatanetworkService.createEdge(req.body);
      messageProducer.produce(
        newEdgeId,
        req.headers["x-actorid"],
        "create",
        [req.body.from, req.body.to],
        { edgeType: req.body.edgeType }
      );
      res.status(201).send(newEdgeId);
    } catch (e) {
      next(e);
    }
  }

  async deleteEdgeById(req, res, next) {
    try {
      const edge = await DatanetworkService.getEdgeById(req.params.id);
      await DatanetworkService.deleteEdgeById(req.params.id);
      messageProducer.produce(
        req.params.id,
        req.headers["x-actorid"],
        "delete",
        [edge.from.id, edge.to.id],
        { edgeType: edge.edgeType }
      );
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async getNodeById(req, res, next) {
    try {
      const result = await DatanetworkService.getNodeById(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async putNode(req, res, next) {
    try {
      const { entityId } = req.body;
      const entityType = entityId.slice(0, entityId.indexOf(":"));
      const newNodeId = await DatanetworkService.createNode(
        entityId,
        entityType
      );
      messageProducer.produce(newNodeId, req.headers["x-actorid"], "create");
      res.status(201).send();
    } catch (e) {
      next(e);
    }
  }

  async deleteNodeById(req, res, next) {
    try {
      const actorId = req.headers["x-actorid"];
      const { collection } = await datanetworkService.getEdges(
        { from: req.params.id },
        true
      );
      await DatanetworkService.deleteNode(req.params.id);
      messageProducer.produce(req.params.id, actorId, "create");
      for (const edge of collection) {
        messageProducer.produce(
          edge.id,
          actorId,
          "delete",
          [edge.from.id, edge.to.id],
          {
            edgeType: edge.edgeType,
          }
        );
      }
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DatanetworkController();
