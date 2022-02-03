const messageProducer = require("@diva/common/messaging/MessageProducer");
const serviceService = require("../services/ServiceService");
const EntityController = require("./EntityController");

const createSingleService = async (service, actorId) => {
  const newServiceId = await serviceService.create(service, actorId);
  messageProducer.produce(newServiceId, actorId, "create");
  return newServiceId;
};

const appendBulkRequestPromiseHandler = (promise, additionalData) =>
  promise
    .then((id) => ({
      statusCode: 201,
      data: id,
    }))
    .catch((err) => ({
      statusCode: err.code || 500,
      data: additionalData,
      error: err,
    }));

const processCreateBulkRequest = async (bulk, actorid) =>
  Promise.all(
    bulk.map((service) =>
      appendBulkRequestPromiseHandler(
        createSingleService(service, actorid),
        service.title
      )
    )
  );

class ServicesController extends EntityController {
  async create(req, res, next) {
    try {
      const actorid = req.headers["x-actorid"];
      if (Array.isArray(req.body)) {
        const result = await processCreateBulkRequest(req.body, actorid);
        res.status(207).send(result);
      } else {
        const result = await createSingleService(req.body, actorid);
        res.status(201).send(result);
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ServicesController(serviceService);
