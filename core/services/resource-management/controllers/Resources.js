const messageProducerService = require("@diva/common/messaging/MessageProducer");
const resourcesService = require("../services/ResourcesService");

const createSingleResource = async (resource, actorid) => {
  const newResourceId = await resourcesService.create(resource, actorid);
  messageProducerService.produce(newResourceId, actorid, "create");
  return newResourceId;
};
const processCreateBulkRequest = async (bulk, actorid) =>
  Promise.all(
    bulk.map((resource) =>
      createSingleResource(resource, actorid)
        .then((newResourceId) => ({
          statusCode: 201,
          uniqueFingerprint: resource.uniqueFingerprint,
          data: newResourceId,
        }))
        .catch((err) => ({
          statusCode: err.code || 500,
          uniqueFingerprint: resource.uniqueFingerprint,
          error: err,
        }))
    )
  );

class ResourcesController {
  async getResources(req, res, next) {
    try {
      const result = await resourcesService.get(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getResource(req, res, next) {
    try {
      const result = await resourcesService.getById(req.params.id, req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async createResource(req, res, next) {
    try {
      const actorId = req.headers["x-actorid"];
      if (Array.isArray(req.body)) {
        const result = await processCreateBulkRequest(req.body, actorId);
        res.status(207).send(result);
      } else {
        const result = await createSingleResource(req.body, actorId);
        res.status(201).send(result);
      }
    } catch (err) {
      return next(err);
    }
  }

  async deleteResource(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      await resourcesService.deleteById(id);
      res.send();
      messageProducerService.produce(id, actorId, "delete");
    } catch (err) {
      return next(err);
    }
  }

  async patchResource(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      await resourcesService.patchById(id, req.body, actorId);
      res.send();
      messageProducerService.produce(id, actorId, "update");
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ResourcesController();
