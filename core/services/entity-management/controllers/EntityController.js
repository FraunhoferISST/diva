const messagesProducer = require("@diva/common/messaging/MessageProducer");

module.exports = class EntityController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res, next) {
    try {
      const newEntityId = await this.service.create(
        req.body,
        req.headers["x-actorid"]
      );
      res.status(201).send(newEntityId);
      messagesProducer.produce(
        newEntityId,
        req.headers["x-actorid"] || newEntityId,
        "create"
      );
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
      await this.service.patchById(id, req.body, req.headers["x-actorid"]);
      res.status(200).send();
      messagesProducer.produce(id, req.headers["x-actorid"], "update");
    } catch (err) {
      return next(err);
    }
  }

  async updateById(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.updateById(id, req.body, req.headers["x-actorid"]);
      res.status(204).send();
      messagesProducer.produce(id, req.headers["x-actorid"], "update");
    } catch (err) {
      return next(err);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.deleteById(id, req.headers["x-actorid"]);
      res.status(200).send();
      messagesProducer.produce(id, req.headers["x-actorid"], "delete");
    } catch (err) {
      return next(err);
    }
  }
};
