const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const {
  servicesMongoDbConnector,
  historyMongoDbConnector,
} = require("../utils/mongoDbConnectors");

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

  validate(service) {
    jsonSchemaValidator.validate(SERVICE_ROOT_SCHEMA, service);
  }
}

module.exports = new ServiceService();
