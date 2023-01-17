const { dataNetworkMessagesProducer } = require("../utils/messagesProducers");
const dataNetworkService = require("../services/DataNetworkService");

class DataNetworkController {
  constructor(service) {
    this.service = service;
  }

  async getEdges(req, res, next) {
    try {
      const { edgeTypes, fromNodeType, toNodeType, ...rest } = req.query;
      const result = await this.service.getEdges({
        edgeTypes: edgeTypes ? edgeTypes.split(",") : null,
        fromNodeType: fromNodeType ? fromNodeType.split(",") : null,
        toNodeType: toNodeType ? toNodeType.split(",") : null,
        ...rest,
      });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getEdgeById(req, res, next) {
    try {
      const result = await this.service.getEdgeById(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async createEdge(req, res, next) {
    try {
      const newEdgeId = await this.service.createEdge(req.body);
      await dataNetworkMessagesProducer.produce(
        newEdgeId,
        req.headers.diva.actorId,
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
      const edge = await this.service.getEdgeById(req.params.id);
      await this.service.patchEdgeById(req.params.id, req.body);
      dataNetworkMessagesProducer.produce(
        req.params.id,
        req.headers.diva.actorId,
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
      const edge = await this.service.getEdgeById(req.params.id);
      await this.service.deleteEdgeById(req.params.id);
      dataNetworkMessagesProducer.produce(
        req.params.id,
        req.headers.diva.actorId,
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
      const result = await this.service.getNodeById(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async createNode(req, res, next) {
    try {
      const { entityId } = req.body;
      const entityType = entityId.slice(0, entityId.indexOf(":"));
      const newNodeId = await this.service.createNode(entityId, entityType);
      dataNetworkMessagesProducer.produce(
        newNodeId,
        req.headers.diva.actorId,
        "create"
      );
      res.status(201).send();
    } catch (e) {
      next(e);
    }
  }

  async deleteNodeById(req, res, next) {
    try {
      const { actorId } = req.headers.diva;
      const { collection } = await this.service.getEdges(
        { from: req.params.id },
        true
      );
      await this.service.deleteNode(req.params.id);
      dataNetworkMessagesProducer.produce(req.params.id, actorId, "create");
      for (const edge of collection) {
        dataNetworkMessagesProducer.produce(
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

module.exports = new DataNetworkController(dataNetworkService);
