const messageProducerService = require("@diva/common/messaging/MessageProducer");
const resourcesService = require("../services/ResourcesService");
const EntityController = require("./EntityController");

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

class ResourcesController extends EntityController {
  async create(req, res, next) {
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
}

module.exports = new ResourcesController(resourcesService);
