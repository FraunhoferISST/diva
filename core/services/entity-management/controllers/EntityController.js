const executeTransaction = require("@diva/common/utils/executeTransaction");
const {
  entitiesMessagesProducer,
  dataNetworkMessagesProducer,
} = require("../utils/messagesProducers");
const dataNetworkService = require("../services/DataNetworkService");

const getAffectedFieldsFromDelta = (delta = {}) => Object.keys(delta);

const createSingleEntity = async (service, entity, actorId, entityType) =>
  executeTransaction(
    [
      () => service.create(entity, actorId),
      ({ id: newEntityId }) =>
        dataNetworkService.updateNode(newEntityId, entityType),
      ({ id: newEntityId, delta }) =>
        entitiesMessagesProducer.produce(
          newEntityId,
          actorId,
          "create",
          entity.attributedTo ? [entity.attributedTo] : [],
          { affectedFields: getAffectedFieldsFromDelta(delta) }
        ),
    ],
    async ({ id }) => {
      if (id) {
        return Promise.all(
          [service.deleteById(id), dataNetworkService.deleteNodeById(id)].map(
            (p) =>
              p.catch((e) => {
                if (e.code === 404) {
                  return true;
                }
                throw e;
              })
          )
        );
      }
    }
  );

const appendBulkRequestPromiseHandler = (promise, additionalData = {}) =>
  promise
    .then((id) => ({
      statusCode: 201,
      data: { id },
    }))
    .catch((err) => ({
      statusCode: err.code || 500,
      data: additionalData,
      error: err,
    }));

const processCreateBulkRequest = async (service, bulk, actorId, entityType) =>
  Promise.all(
    bulk.map((entity) =>
      appendBulkRequestPromiseHandler(
        createSingleEntity(service, entity, actorId, entityType),
        entity ?? {}
      )
    )
  );

module.exports = class EntityController {
  constructor(service) {
    this.service = service;
    this.dataNetwrokService = dataNetworkService;
  }

  getAffectedFieldsFromDelta(delta = {}) {
    return getAffectedFieldsFromDelta(delta);
  }

  async create(req, res, next) {
    try {
      const { actorId } = req.headers.diva;
      if (Array.isArray(req.body)) {
        const result = await processCreateBulkRequest(
          this.service,
          req.body,
          actorId,
          this.service.entityType
        );
        res.status(207).send(result);
      } else {
        const { id } = await createSingleEntity(
          this.service,
          req.body,
          actorId,
          this.service.entityType
        );
        res.status(201).send(id);
      }
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    try {
      const result = await this.service.get(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await this.service.getById(
        req.params.id,
        req.query,
        req.policyPayload
      );
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async patchById(req, res, next) {
    try {
      const { id } = req.params;
      const { actorId } = req.headers.diva;
      await executeTransaction([
        () => this.service.patchById(id, req.body, actorId),
        ({ delta }) =>
          entitiesMessagesProducer.produce(id, actorId, "update", [], {
            affectedFields: this.getAffectedFieldsFromDelta(delta),
          }),
      ]);
      res.status(200).send();
    } catch (err) {
      return next(err);
    }
  }

  async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const { actorId } = req.headers.diva;
      const { upsert: upserted } = await executeTransaction(
        [
          () => this.service.updateById(id, req.body, actorId),
          async ({ upsert }) =>
            upsert
              ? {
                  nodeId: await this.dataNetwrokService.createNode(
                    id,
                    this.service.entityType
                  ),
                }
              : {},
          ({ delta, upsert }) =>
            entitiesMessagesProducer.produce(
              id,
              actorId,
              upsert ? "create" : "update",
              [],
              {
                affectedFields: this.getAffectedFieldsFromDelta(delta),
              }
            ),
        ],
        async ({ nodeId, upsert }) => {
          if (upsert) {
            await this.service.deleteById(id);
          }
          if (nodeId) {
            await this.dataNetwrokService.deleteNodeById(id);
          }
        }
      );
      res.status(upserted ? 201 : 200).send();
    } catch (err) {
      return next(err);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const { actorId } = req.headers.diva;
      const entityToDelete = await this.service.getById(id);
      await executeTransaction(
        [
          async () =>
            this.service.collection.updateOne(
              { id },
              { $set: { isEditable: false } }
            ),
          async () => {
            const { collection: edges } =
              await this.dataNetwrokService.getEdges({
                from: id,
                bidirectional: true,
                pageSize: -1,
              });
            return { edges };
          },
          async () =>
            this.dataNetwrokService
              .deleteNodeById(id)
              .then(() => ({ deletedNodeId: id })),
          ({ edges }) =>
            edges.forEach((edge) =>
              dataNetworkMessagesProducer.produce(
                edge.properties.id,
                actorId,
                "delete",
                [edge.from.entityId, edge.to.entityId],
                {
                  edgeType: edge.edgeType,
                }
              )
            ),
          () =>
            this.service
              .deleteById(id, actorId)
              .then(() => ({ deletedId: id })),
          () => entitiesMessagesProducer.produce(id, actorId, "delete", []),
        ],
        async ({ deletedId, deletedNodeId }) => {
          await this.service.collection.updateOne(
            { id },
            { $set: { isEditable: true } }
          );
          if (deletedId) {
            await this.service.insert(entityToDelete);
          }
          if (deletedNodeId) {
            await this.dataNetwrokService.createNode(
              entityToDelete.id,
              this.service.entityType
            );
          }
        }
      );
      res.status(200).send();
    } catch (err) {
      return next(err);
    }
  }

  async addImage(req, res, next) {
    try {
      const { actorId } = req.headers.diva;
      const newImageId = await this.service.addImage(
        req.params.id,
        req.file,
        actorId
      );
      const { attributedTo } = await this.service.getById(req.params.id);
      res.status(201).send(newImageId);
      entitiesMessagesProducer.produce(
        req.params.id,
        actorId,
        "update",
        attributedTo ? [attributedTo] : []
      );
    } catch (err) {
      return next(err);
    }
  }

  async getImageById(req, res, next) {
    try {
      await this.service.getById(req.params.id); // make sure corresponding entity exists
      const { stream, contentType } = await this.service.getImageById(
        req.params.imageId
      );
      res.header("Content-Type", contentType);
      stream.pipe(res);
    } catch (err) {
      return next(err);
    }
  }

  async deleteImageById(req, res, next) {
    try {
      const { actorId } = req.headers.diva;
      await this.service.deleteImageById(
        req.params.id,
        req.params.imageId,
        actorId
      );
      res.status(200).send();
      entitiesMessagesProducer.produce(req.params.id, actorId, "update", []);
    } catch (err) {
      return next(err);
    }
  }
};
