const express = require("express");
const resourcesController = require("../controllers/ResourcesController");
const resourcesService = require("../services/ResourcesService");
const usersController = require("../controllers/UsersController");
const userImagesController = require("../controllers/UserImagesController");
const reviewsController = require("../controllers/ReviewsController");
const assetsController = require("../controllers/AssetsController");
const assetImagesController = require("../controllers/AssetImagesController");
const servicesController = require("../controllers/ServicesController");
const serviceImagesController = require("../controllers/ServiceImagesController");
const assetService = require("../services/AssetService");
const reviewsService = require("../services/ReviewsService");
const serviceService = require("../services/ServiceService");
const usersService = require("../services/UsersService");
const CustomService = require("../services/CustomService");
const { collectionsNames } = require("../utils/constants");
const EntityController = require("../controllers/EntityController");

const predefinedEntities = {
  [collectionsNames.RESOURCE_COLLECTION_NAME]: {
    name: collectionsNames.RESOURCE_COLLECTION_NAME,
    controller: resourcesController,
    service: resourcesService,
  },
  [collectionsNames.ASSETS_COLLECTION_NAME]: {
    name: collectionsNames.ASSETS_COLLECTION_NAME,
    controller: resourcesController,
    service: resourcesService,
  },
  [collectionsNames.USERS_COLLECTION_NAME]: {
    name: collectionsNames.USERS_COLLECTION_NAME,
    controller: resourcesController,
    service: resourcesService,
  },
  users: usersController,
  assets: assetsController,
  services: servicesController,
  reviews: reviewsController,
};

const createEntityService = (entity) => new CustomService(entity);

const createEntityController = (service) => new EntityController(service);

module.exports = async () => {
  const router = express.Router();

  for (const entity in Object.values(predefinedEntities)) {
    const service = entity.service ?? createEntityService(entity.name);
    await service.init();
    const controller = entity?.controller ?? createEntityController(service);

    router.get(`/${entity}`, controller.get);
    router.get(`/${entity}/:id`, controller.getById);
    router.post(`/${entity}`, controller.create);
    router.patch(`/${entity}/:id`, controller.patchById);
    router.post(`/${entity}/:id`, controller.patchById);
    router.put(`/${entity}/:id`, controller.updateById);
    router.delete(`/${entity}/:id`, controller.deleteById);
  }
  return router;
};
