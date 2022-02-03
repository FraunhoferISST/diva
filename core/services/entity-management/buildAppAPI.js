const express = require("express");
const buildOpenApiSpec = require("./utils/buildOpenApiSpec");
const resourcesController = require("./controllers/ResourcesController");
const resourcesService = require("./services/ResourcesService");
const usersController = require("./controllers/UsersController");
const userImagesController = require("./controllers/UserImagesController");
const reviewsController = require("./controllers/ReviewsController");
const assetsController = require("./controllers/AssetsController");
const assetImagesController = require("./controllers/AssetImagesController");
const servicesController = require("./controllers/ServicesController");
const serviceImagesController = require("./controllers/ServiceImagesController");
const assetService = require("./services/AssetService");
const reviewsService = require("./services/ReviewsService");
const serviceService = require("./services/ServiceService");
const usersService = require("./services/UsersService");
const CustomService = require("./services/CustomService");
const { collectionsNames } = require("./utils/constants");
const EntityController = require("./controllers/EntityController");

const predefinedEntities = {
  [collectionsNames.RESOURCE_COLLECTION_NAME]: {
    name: collectionsNames.RESOURCE_COLLECTION_NAME,
    controller: resourcesController,
    service: resourcesService,
  },
  [collectionsNames.ASSETS_COLLECTION_NAME]: {
    name: collectionsNames.ASSETS_COLLECTION_NAME,
    controller: assetsController,
    service: assetService,
  },
  [collectionsNames.USERS_COLLECTION_NAME]: {
    name: collectionsNames.USERS_COLLECTION_NAME,
    controller: usersController,
    service: usersService,
  },
  services: {
    name: collectionsNames.SERVICES_COLLECTION_NAME,
    controller: serv,
    service: null,
  },
  reviews: {
    name: collectionsNames.REVIEWS_COLLECTION_NAME,
    controller: null,
    service: null,
  },
};

const createEntityService = (entity) => new CustomService(entity);

const createEntityController = (service) => new EntityController(service);

module.exports = async (server) => {
  const router = express.Router();

  for (const entity of Object.values(predefinedEntities)) {
    const service = entity.service ?? createEntityService(entity.name);
    await service.init();
    const controller = entity?.controller ?? createEntityController(service);

    router.get(`/${entity.name}`, controller.get.bind(controller));
    router.get(`/${entity.name}/:id`, controller.getById.bind(controller));
    router.post(`/${entity.name}`, controller.create.bind(controller));
    router.patch(`/${entity.name}/:id`, controller.patchById.bind(controller));
    router.post(`/${entity.name}/:id`, controller.patchById.bind(controller));
    router.put(`/${entity.name}/:id`, controller.updateById.bind(controller));
    router.delete(
      `/${entity.name}/:id`,
      controller.deleteById.bind(controller)
    );
  }
  const openApiSpec = buildOpenApiSpec(Object.keys(predefinedEntities));
  server.addMiddleware("/", router);
  return server.boot({ openApiSpec });
};
