const messageProducer = require("@diva/common/messaging/MessageProducer");

const getAffectedFieldsFromDelta = (delta = {}) => Object.keys(delta);

const createSingleEntity = async (service, entity, actorId) =>
  service.create(entity, actorId).then(({ id: newEntityId, delta }) => {
    messageProducer.produce(
      newEntityId,
      actorId,
      "create",
      entity.attributedTo ? [entity.attributedTo] : [],
      { affectedFields: getAffectedFieldsFromDelta(delta) }
    );
    return newEntityId;
  });

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

const processCreateBulkRequest = async (service, bulk, actorid) =>
  Promise.all(
    bulk.map((entity) =>
      appendBulkRequestPromiseHandler(
        createSingleEntity(service, entity, actorid),
        entity ?? {}
      )
    )
  );

module.exports = class EntityController {
  constructor(service) {
    this.service = service;
  }

  getAffectedFieldsFromDelta(delta = {}) {
    return getAffectedFieldsFromDelta(delta);
  }

  async create(req, res, next) {
    try {
      const actorid = req.headers["x-actorid"];
      if (Array.isArray(req.body)) {
        const result = await processCreateBulkRequest(
          this.service,
          req.body,
          actorid
        );
        res.status(207).send(result);
      } else {
        const result = await createSingleEntity(
          this.service,
          req.body,
          actorid
        );
        res.status(201).send(result);
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
      const result = await this.service.getById(req.params.id, req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async patchById(req, res, next) {
    try {
      const { id } = req.params;
      const { delta } = await this.service.patchById(
        id,
        req.body,
        req.headers["x-actorid"]
      );
      const { attributedTo } = await this.service.getById(id);
      res.status(200).send();
      messageProducer.produce(
        id,
        req.headers["x-actorid"],
        "update",
        attributedTo ? [attributedTo] : [],
        { affectedFields: this.getAffectedFieldsFromDelta(delta) }
      );
    } catch (err) {
      return next(err);
    }
  }

  async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const { delta } = await this.service.updateById(
        id,
        req.body,
        req.headers["x-actorid"]
      );
      res.status(204).send();
      messageProducer.produce(
        id,
        req.headers["x-actorid"],
        "update",
        req.body.attributedTo ? [req.body.attributedTo] : [],
        { affectedFields: this.getAffectedFieldsFromDelta(delta) }
      );
    } catch (err) {
      return next(err);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const { attributedTo } = await this.service.getById(id);
      await this.service.deleteById(id, req.headers["x-actorid"]);
      res.status(200).send();
      messageProducer.produce(
        id,
        req.headers["x-actorid"],
        "delete",
        attributedTo ? [attributedTo] : []
      );
    } catch (err) {
      return next(err);
    }
  }

  async addImage(req, res, next) {
    try {
      const newImageId = await this.service.addImage(
        req.params.id,
        req.file,
        req.headers["x-actorid"]
      );
      const { attributedTo } = await this.service.getById(req.params.id);
      res.status(201).send(newImageId);
      messageProducer.produce(
        req.params.id,
        req.headers["x-actorid"],
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
      await this.service.deleteImageById(
        req.params.id,
        req.params.imageId,
        req.headers["x-actorid"]
      );
      const { attributedTo } = await this.service.getById(req.params.id);
      res.status(200).send();
      messageProducer.produce(
        req.params.id,
        req.headers["x-actorid"],
        "update",
        attributedTo ? [attributedTo] : []
      );
    } catch (err) {
      return next(err);
    }
  }
};
