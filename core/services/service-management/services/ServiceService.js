const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const { encodeCursor, decodeCursor } = require("@diva/common/api/cursor");
const generateUuid = require("@diva/common/generateUuid");
const {
  servicesMongoDbConnector,
  historyMongoDbConnector,
} = require("../utils/mongoDbConnectors");
const {
  linkServiceToItselfError,
  serviceNotFoundError,
} = require("../utils/errors");

const SERVICE_ROOT_SCHEMA = process.env.SERVICE_ROOT_SCHEMA || "service";
const servicesCollectionName = process.env.MONGO_COLLECTION_NAME || "services";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class ServiceService extends EntityService {
  async init() {
    await historyMongoDbConnector.connect();
    await servicesMongoDbConnector.connect();
    this.collection = servicesMongoDbConnector.collections[servicesCollectionName];
    this.historyCollection =
      historyMongoDbConnector.collections[historyCollectionName];
    this.jsonSchemaValidator = jsonSchemaValidator;
  }

  async create(service, actorId) {
    return super.create(
      {
        ...service,
        id: generateUuid("service"),
        entityType: "service",
      },
      actorId
    );
  }

  async linkEntity(serviceId, entityId, actorId) {
    if (serviceId === entityId) {
      throw linkServiceToItselfError;
    }
    const existingService = await this.getById(serviceId);
    if (existingService) {
      const { value: newService } = await this.collection.findOneAndUpdate(
        { id: serviceId },
        {
          $addToSet: { entities: entityId },
          $set: {
            modified: new Date().toISOString(),
          },
        },
        { returnDocument: "after" }
      );
      await this.createHistoryEntry(
        existingService,
        this.sanitizeEntity(newService),
        actorId
      );
      return newService;
    }
    throw serviceNotFoundError;
  }

  async unlinkEntity(serviceId, entityId, actorId) {
    const existingService = await this.getById(serviceId);
    if (existingService) {
      const { value: newService } = await this.collection.findOneAndUpdate(
        { id: serviceId },
        {
          $pull: { entities: entityId },
          $set: {
            modified: new Date().toISOString(),
          },
        },
        { returnDocument: "after" }
      );
      await this.createHistoryEntry(
        existingService,
        this.sanitizeEntity(newService),
        actorId
      );
      return newService;
    }
    throw serviceNotFoundError;
  }

  async getLinkedEntities(serviceId, query) {
    const { cursor, pageSize = 30 } = query;
    const parsedPageSize = parseInt(pageSize, 10);
    const startIndex = cursor ? parseInt(decodeCursor(cursor), 10) + 1 : 0;
    const endIndex = startIndex + parsedPageSize - 1;
    const service = await this.collection.findOne(
      { id: serviceId },
      { entities: true, _id: false }
    );
    if (service) {
      const { entities } = service;
      const page = entities.slice(startIndex, endIndex + 1);
      return {
        collectionSize: page.length,
        collection: page,
        cursor: entities[endIndex + 1] && encodeCursor(endIndex.toString()),
        total: entities.length,
      };
    }
    throw serviceNotFoundError;
  }

  validate(service) {
    jsonSchemaValidator.validate(SERVICE_ROOT_SCHEMA, service);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }
}

module.exports = new ServiceService();
