const express = require("express");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const buildOpenApiSpec = require("./utils/buildOpenApiSpec");
const usersController = require("./controllers/UsersController");
const usersService = require("./services/UsersService");
const EntityService = require("./services/EntityService");
const { entities } = require("./utils/constants");
const { singularizeCollectionName } = require("./utils/utils");
const EntityController = require("./controllers/EntityController");
const { mongoDbConnector } = require("./utils/mongoDbConnector");

const ENTITY_ROOT_SCHEMA = process.env.ENTITY_ROOT_SCHEMA || "entity";

const predefinedEntities = {
  resources: {
    type: entities.RESOURCES.type,
    collection: entities.RESOURCES.collection,
    controller: null,
    service: null,
  },
  assets: {
    type: entities.ASSETS.type,
    collection: entities.ASSETS.collection,
    controller: null,
    service: null,
  },
  users: {
    type: entities.USERS.type,
    collection: entities.USERS.collection,
    controller: usersController,
    service: usersService,
  },
  policies: {
    type: entities.POLICIES.type,
    collection: entities.POLICIES.collection,
    controller: null,
    service: null,
  },
  services: {
    type: entities.SERVICES.type,
    collection: entities.SERVICES.collection,
    controller: null,
    service: null,
  },
  reviews: {
    type: entities.REVIEWS.type,
    collection: entities.REVIEWS.collection,
    controller: null,
    service: null,
  },
};

const createEntityService = (predefinedEntity) =>
  new EntityService(predefinedEntity.type, predefinedEntity.collection);

const createEntityController = (service) => new EntityController(service);

module.exports = async (server) => {
  const router = express.Router();

  await jsonSchemaValidator.init([ENTITY_ROOT_SCHEMA]);
  await mongoDbConnector.connect();

  for (const [pathName, entity] of Object.entries(predefinedEntities)) {
    const service = entity.service ?? createEntityService(entity);
    await service.init();
    const controller = entity?.controller ?? createEntityController(service);

    router.get(`/${pathName}`, controller.get.bind(controller));
    router.get(`/${pathName}/:id`, controller.getById.bind(controller));
    router.post(`/${pathName}`, controller.create.bind(controller));
    router.patch(`/${pathName}/:id`, controller.patchById.bind(controller));
    router.post(`/${pathName}/:id`, controller.patchById.bind(controller));
    router.put(`/${pathName}/:id`, controller.updateById.bind(controller));
    router.delete(`/${pathName}/:id`, controller.deleteById.bind(controller));

    router.post(
      `/${pathName}/:id/images`,
      controller.addImage.bind(controller)
    );
    router.get(
      `/${pathName}/:id/images/:imageId`,
      controller.getImageById.bind(controller)
    );
    router.delete(
      `/${pathName}/:id/images/:imageId`,
      controller.deleteImageById.bind(controller)
    );
  }

  const openApiSpec = buildOpenApiSpec(Object.keys(predefinedEntities));
  server.initBasicMiddleware();
  server.addOpenApiValidatorMiddleware(openApiSpec);
  server.addMiddleware((req, res, next) => {
    if (req.files) {
      req.file = req.files[0];
      delete req.body.image;
    }
    next();
  });
  server.addMiddleware("/", router);
  return server.boot();
};
