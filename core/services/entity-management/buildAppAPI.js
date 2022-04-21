const express = require("express");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const buildOpenApiSpec = require("./utils/buildOpenApiSpec");
const usersService = require("./services/UsersService");
const EntityService = require("./services/EntityService");
const { collectionsNames, entityTypes } = require("./utils/constants");
const EntityController = require("./controllers/EntityController");
const { mongoDbConnector } = require("./utils/mongoDbConnector");
const { name: serviceName } = require("./package.json");
// System entities
const schemataService = require("./services/SchemataService");
const schemataController = require("./controllers/SchemataController");
const asyncapisService = require("./services/AsyncapisService");
const asyncapisController = require("./controllers/AsyncapisController");
const rulesService = require("./services/RulesService");
const policiesService = require("./services/PoliciesService");

const topic = process.env.KAFKA_EVENT_TOPIC || "entity.events";
const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const predefinedEntities = {
  [collectionsNames.RESOURCE_COLLECTION_NAME]: {
    collection: collectionsNames.RESOURCE_COLLECTION_NAME,
    controller: null,
    service: null,
    entityType: entityTypes.RESOURCE,
  },
  [collectionsNames.ASSETS_COLLECTION_NAME]: {
    collection: collectionsNames.ASSETS_COLLECTION_NAME,
    controller: null,
    service: null,
    entityType: entityTypes.ASSET,
  },
  [collectionsNames.USERS_COLLECTION_NAME]: {
    collection: collectionsNames.USERS_COLLECTION_NAME,
    controller: null,
    service: usersService,
    entityType: entityTypes.USER,
  },
  [collectionsNames.SERVICES_COLLECTION_NAME]: {
    collection: collectionsNames.SERVICES_COLLECTION_NAME,
    controller: null,
    service: null,
    entityType: entityTypes.SERVICE,
  },
  [collectionsNames.REVIEWS_COLLECTION_NAME]: {
    collection: collectionsNames.REVIEWS_COLLECTION_NAME,
    controller: null,
    service: null,
    entityType: entityTypes.REVIEW,
  },
  // System entities
  [collectionsNames.RULES_COLLECTION_NAME]: {
    collection: collectionsNames.RULES_COLLECTION_NAME,
    controller: null,
    service: rulesService,
    entityType: entityTypes.SYSTEM_ENTITY,
  },
  [collectionsNames.POLICIES_COLLECTION_NAME]: {
    collection: collectionsNames.POLICIES_COLLECTION_NAME,
    controller: null,
    service: policiesService,
    entityType: entityTypes.SYSTEM_ENTITY,
  },
  [collectionsNames.SCHEMATA_COLLECTION_NAME]: {
    collection: collectionsNames.SCHEMATA_COLLECTION_NAME,
    controller: schemataController,
    service: schemataService,
    entityType: entityTypes.SYSTEM_ENTITY,
  },
  [collectionsNames.ASYNCAPI_COLLECTION_NAME]: {
    collection: collectionsNames.ASYNCAPI_COLLECTION_NAME,
    controller: asyncapisController,
    service: asyncapisService,
    entityType: entityTypes.SYSTEM_ENTITY,
  },
  // Generic route for ally for all kinds of custom entities
  [collectionsNames.ENTITY_COLLECTION_NAME]: {
    collection: collectionsNames.ENTITY_COLLECTION_NAME,
    controller: null,
    service: null,
    entityType: null,
  },
};

const createEntityService = (entityType) => new EntityService(entityType);

const createEntityController = (service) => new EntityController(service);

module.exports = async (server) => {
  const router = express.Router();

  await mongoDbConnector.connect();
  await schemataService.init();
  await asyncapisService.init();
  await messagesProducer.init(
    topic,
    serviceName,
    "entityEvents",
    {
      name: "asyncapi",
      specification: (await asyncapisService.getByName("asyncapi")).asyncapi,
    },
    producer
  );
  await jsonSchemaValidator.init([await schemataService.resolveEntitySchema()]);

  for (const entity of Object.values(predefinedEntities)) {
    const { collection, entityType } = entity;
    const service = entity.service ?? createEntityService(entityType);
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

  router.post(
    `/scopedSchemata`,
    schemataController.getByScope.bind(schemataController)
  );

  router.get(
    `/resolvedSchemata/:name`,
    schemataController.getResolvedEntitySchema.bind(schemataController)
  );

  router.get(
    `/asyncapis/byName/:name`,
    asyncapisController.getByName.bind(asyncapisController)
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
