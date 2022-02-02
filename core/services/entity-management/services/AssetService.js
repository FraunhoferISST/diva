const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const { mongoDBConnector } = require("../utils/mongoDbConnectors");

const ASSET_ROOT_SCHEMA = process.env.ASSET_ROOT_SCHEMA || "asset";
const assetsCollectionName = process.env.MONGO_COLLECTION_NAME || "assets";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class AssetService extends EntityService {
  async init() {
    await mongoDBConnector.connect();
    this.collection = mongoDBConnector.collections[assetsCollectionName];
    this.historyCollection =
      mongoDBConnector.collections[historyCollectionName];
    this.jsonSchemaValidator = jsonSchemaValidator;
  }

  async create(asset, actorId) {
    return super.create(
      {
        ...asset,
        id: generateUuid("asset"),
        entityType: "asset",
      },
      actorId
    );
  }

  validate(asset) {
    jsonSchemaValidator.validate(ASSET_ROOT_SCHEMA, asset);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }
}

module.exports = new AssetService();
