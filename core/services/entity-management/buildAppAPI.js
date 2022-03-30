const express = require("express");
const asyncapiParser = require("@asyncapi/parser");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const buildOpenApiSpec = require("./utils/buildOpenApiSpec");
const usersController = require("./controllers/UsersController");
const usersService = require("./services/UsersService");
const systemEntitiesService = require("./services/SystemEntitiesService");
const systemEntitiesController = require("./controllers/SystemEntityController");
const EntityService = require("./services/EntityService");
const { collectionsNames } = require("./utils/constants");
const { singularizeCollectionName } = require("./utils/utils");
const EntityController = require("./controllers/EntityController");
const { mongoDbConnector } = require("./utils/mongoDbConnector");
const { name: serviceName } = require("./package.json");

const ENTITY_ROOT_SCHEMA = "entity";
const topic = process.env.KAFKA_EVENT_TOPIC || "entity.events";
const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const predefinedEntities = {
  [collectionsNames.SYSTEM_ENTITY_COLLECTION_NAME]: {
    collection: collectionsNames.SYSTEM_ENTITY_COLLECTION_NAME,
    controller: systemEntitiesController,
    service: systemEntitiesService,
  },
  [collectionsNames.RESOURCE_COLLECTION_NAME]: {
    collection: collectionsNames.RESOURCE_COLLECTION_NAME,
    controller: null,
    service: null,
  },
  [collectionsNames.ASSETS_COLLECTION_NAME]: {
    collection: collectionsNames.ASSETS_COLLECTION_NAME,
    controller: null,
    service: null,
  },
  [collectionsNames.USERS_COLLECTION_NAME]: {
    collection: collectionsNames.USERS_COLLECTION_NAME,
    controller: usersController,
    service: usersService,
  },
  services: {
    collection: collectionsNames.SERVICES_COLLECTION_NAME,
    controller: null,
    service: null,
  },
  reviews: {
    collection: collectionsNames.REVIEWS_COLLECTION_NAME,
    controller: null,
    service: null,
  },
};

const createEntityService = (entityType) => new EntityService(entityType);

const createEntityController = (service) => new EntityController(service);

module.exports = async (server) => {
  const router = express.Router();

  await mongoDbConnector.connect();
  await systemEntitiesService.init();
  await messagesProducer.init(
    topic,
    serviceName,
    "entityEvents",
    {
      name: "asyncapi",
      specification: (
        await asyncapiParser.parse(
          (
            await systemEntitiesService.getEntityByName("asyncapi", "asyncapi")
          ).asyncapi
        )
      )._json,
    },
    producer
  );
  await jsonSchemaValidator.init([
    await systemEntitiesService.resolveSchemaByName(ENTITY_ROOT_SCHEMA),
  ]);

  for (const entity of Object.values(predefinedEntities)) {
    const { collection } = entity;
    const service =
      entity.service ??
      createEntityService(singularizeCollectionName(collection));
    await service.init();
    const controller = entity?.controller ?? createEntityController(service);

    router.get(`/${collection}`, controller.get.bind(controller));
    router.get(`/${collection}/:id`, controller.getById.bind(controller));
    router.post(`/${collection}`, controller.create.bind(controller));
    router.patch(`/${collection}/:id`, controller.patchById.bind(controller));
    router.post(`/${collection}/:id`, controller.patchById.bind(controller));
    router.put(`/${collection}/:id`, controller.updateById.bind(controller));
    router.delete(`/${collection}/:id`, controller.deleteById.bind(controller));

    router.post(
      `/${collection}/:id/images`,
      controller.addImage.bind(controller)
    );
    router.get(
      `/${collection}/:id/images/:imageId`,
      controller.getImageById.bind(controller)
    );
    router.delete(
      `/${collection}/:id/images/:imageId`,
      controller.deleteImageById.bind(controller)
    );
  }

  router.get(
    `/systemEntities/resolvedSchemas/:name`,
    systemEntitiesController.resolveSchemaByName.bind(systemEntitiesController)
  );

  router.get(
    `/systemEntities/byName/:name`,
    systemEntitiesController.getSpecificationEntityByName.bind(
      systemEntitiesController
    )
  );

  const openApiSpec = buildOpenApiSpec(Object.keys(predefinedEntities));
  server.initBasicMiddleware();
  server.addOpenApiValidatorMiddleware(openApiSpec);
  server.addPolicyValidatorMiddleware();
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
