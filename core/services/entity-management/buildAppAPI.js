const express = require("express");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const buildOpenApiSpec = require("./utils/buildOpenApiSpec");
const {
  dataNetworkMessagesProducer,
  entitiesMessagesProducer,
} = require("./utils/messagesProducers");
const usersService = require("./services/UsersService");
const EntityService = require("./services/EntityService");
const { collectionsNames, entityTypes } = require("./utils/constants");
const EntityController = require("./controllers/EntityController");
const { mongoDbConnector } = require("./utils/mongoDbConnector");
const { name: serviceName } = require("./package.json");
const defaultEntities = require("./defaultEntities/index");
// System entities
const schemataService = require("./services/SchemataService");
const schemataController = require("./controllers/SchemataController");
const asyncapisService = require("./services/AsyncapisService");
const asyncapisController = require("./controllers/AsyncapisController");
const rulesService = require("./services/RulesService");
const policiesService = require("./services/PoliciesService");
const dataNetworkService = require("./services/DataNetworkService");
const dataNetworkController = require("./controllers/DataNetworkController");
const dataNetworkRouter = require("./routes/dataNetwork");
const { serviceId } = require("./package.json");

const entitiesTopic = "entity.events";
const dataNetworkTopic = "entity.datanetwork";
const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;

const predefinedEntities = {
  // System entities
  // Make sure schemata defined before other system entities
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
};

const createEntityService = (entityType, collectionName) =>
  new EntityService(entityType, {
    defaultEntities: defaultEntities[collectionName],
  });

const createEntityController = (service) => new EntityController(service);

module.exports = async (server) => {
  const router = express.Router();

  await mongoDbConnector.connect();
  await asyncapisService.init();
  await asyncapisService.loadDefault();
  await schemataService.init();
  await schemataService.loadDefault();
  await jsonSchemaValidator.init([await schemataService.resolveEntitySchema()]);
  await dataNetworkService.init();
  await entitiesMessagesProducer.init(
    entitiesTopic,
    serviceName,
    "entityEvents",
    {
      name: "asyncapi",
      specification: (await asyncapisService.getByName("asyncapi")).asyncapi,
    },
    producer
  );
  await dataNetworkMessagesProducer.init(
    dataNetworkTopic,
    serviceName,
    "datanetworkEvents",
    {
      name: "datanetwork-api",
      specification: (
        await asyncapisService.getByName("datanetwork-api")
      ).asyncapi,
    },
    producer
  );

  for (const entity of Object.values(predefinedEntities)) {
    const { collection, entityType } = entity;
    const service =
      entity.service ?? createEntityService(entityType, collection);
    await service.init().then(async () => {
      await service.loadDefault();
      (defaultEntities[collection] ?? []).map(({ id }) =>
        entitiesMessagesProducer.produce(id, serviceId)
      );
    });
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
  server.addMiddleware("/", dataNetworkRouter);
  return server.boot();
};
