const messageProducer = require("@diva/common/messaging/MessageProducer");
const datanetworkService = require("../services/DatanetworkService");
const { name: serviceName } = require("../package.json");

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;
const producerTopic = "datanetwork.events";

class DatanetworkController {
  async init() {
    await messageProducer.init(
      producerTopic,
      serviceName,
      "datanetworkEvents",
      "datanetwork-api",
      producer
    );
    return datanetworkService.init();
  }

  async getEdges(req, res, next) {
    try {
      const { from, edgeTypes, to } = req.query;
      const result = await datanetworkService.getEdges(
        {
          from,
          edgeTypes: edgeTypes ? edgeTypes.split(",") : null,
          to,
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
      const result = await datanetworkService.getEdgeById(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async postEdge(req, res, next) {
    try {
      const newEdgeId = await datanetworkService.createEdge(req.body);
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

  async patchEdge(req, res, next) {
    try {
      const edge = await datanetworkService.getEdgeById(req.params.id);
      console.log(edge);
      await datanetworkService.patchEdgeById(edge, req.body);
      messageProducer.produce(
        req.params.id,
        req.headers["x-actorid"],
        "update",
        [edge.from.entityId, edge.to.entityId],
        { edgeType: edge.edgeType }
      );
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async deleteEdgeById(req, res, next) {
    try {
      const edge = await datanetworkService.getEdgeById(req.params.id);
      await datanetworkService.deleteEdgeById(req.params.id);
      messageProducer.produce(
        req.params.id,
        req.headers["x-actorid"],
        "delete",
        [edge.from.entityId, edge.to.entityId],
        { edgeType: edge.edgeType }
      );
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async getNodeById(req, res, next) {
    try {
      const result = await datanetworkService.getNodeById(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async putNode(req, res, next) {
    try {
      const { entityId } = req.body;
      const entityType = entityId.slice(0, entityId.indexOf(":"));
      const newNodeId = await datanetworkService.createNode(
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
      await datanetworkService.deleteNode(req.params.id);
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
