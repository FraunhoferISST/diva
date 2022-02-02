const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const { mongoDBConnector } = require("../utils/mongoDbConnectors");

const RESOURCES_ROOT_SCHEMA = process.env.USER_ROOT_SCHEMA || "resource";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

const resourcesCollectionName =
  process.env.MONGO_COLLECTION_NAME || "resources";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class ResourcesService extends EntityService {
  async init() {
    await jsonSchemaValidator.init([
      RESOURCES_ROOT_SCHEMA,
      HISTORY_ROOT_SCHEMA,
    ]);
    await mongoDBConnector.connect();
    this.collection = mongoDBConnector.collections[resourcesCollectionName];
    this.historyCollection =
      mongoDBConnector.collections[historyCollectionName];
    this.jsonSchemaValidator = jsonSchemaValidator;
    this.collection.createIndex(
      { uniqueFingerprint: 1 },
      {
        unique: true,
        sparse: true,
      }
    );
  }

  async create(resource, actorId) {
    const newResource = {
      ...resource,
      id: generateUuid("resource"),
      entityType: "resource",
    };
    return super.create(newResource, actorId);
  }

  validate(resource) {
    jsonSchemaValidator.validate(RESOURCES_ROOT_SCHEMA, resource);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }
}

module.exports = new ResourcesService();
