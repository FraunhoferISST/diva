const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const { encodeCursor, decodeCursor } = require("@diva/common/api/cursor");
const generateUuid = require("@diva/common/generateUuid");
const {
  assetsMongoDbConnector,
  historyMongoDbConnector,
} = require("../utils/mongoDbConnectors");
const {
  linkAssetToItselfError,
  assetNotFoundError,
} = require("../utils/errors");

const ASSET_ROOT_SCHEMA = process.env.ASSET_ROOT_SCHEMA || "asset";
const assetsCollectionName = process.env.MONGO_COLLECTION_NAME || "assets";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class AssetService extends EntityService {
  async init() {
    await historyMongoDbConnector.connect();
    await assetsMongoDbConnector.connect();
    this.collection = assetsMongoDbConnector.collections[assetsCollectionName];
    this.historyCollection =
      historyMongoDbConnector.collections[historyCollectionName];
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

  async linkEntity(assetId, entityId, actorId) {
    if (assetId === entityId) {
      throw linkAssetToItselfError;
    }
    const existingAsset = await this.getById(assetId);
    if (existingAsset) {
      const { value: newAsset } = await this.collection.findOneAndUpdate(
        { id: assetId },
        {
          $addToSet: { entities: entityId },
          $set: {
            modified: new Date().toISOString(),
          },
        },
        { returnOriginal: false }
      );
      await this.createHistoryEntry(
        existingAsset,
        this.sanitizeEntity(newAsset),
        actorId
      );
      return newAsset;
    }
    throw assetNotFoundError;
  }

  async unlinkEntity(assetId, entityId, actorId) {
    const existingAsset = await this.getById(assetId);
    if (existingAsset) {
      const { value: newAsset } = await this.collection.findOneAndUpdate(
        { id: assetId },
        {
          $pull: { entities: entityId },
          $set: {
            modified: new Date().toISOString(),
          },
        },
        { returnOriginal: false }
      );
      await this.createHistoryEntry(
        existingAsset,
        this.sanitizeEntity(newAsset),
        actorId
      );
      return newAsset;
    }
    throw assetNotFoundError;
  }

  async getLinkedEntities(assetId, query) {
    const { cursor, pageSize = 30 } = query;
    const parsedPageSize = parseInt(pageSize, 10);
    const startIndex = cursor ? parseInt(decodeCursor(cursor), 10) + 1 : 0;
    const endIndex = startIndex + parsedPageSize - 1;
    const asset = await this.collection.findOne(
      { id: assetId },
      { entities: true, _id: false }
    );
    if (asset) {
      const { entities } = asset;
      const page = entities.slice(startIndex, endIndex + 1);
      return {
        collectionSize: page.length,
        collection: page,
        cursor: entities[endIndex + 1] && encodeCursor(endIndex.toString()),
        total: entities.length,
      };
    }
    throw assetNotFoundError;
  }

  validate(asset) {
    jsonSchemaValidator.validate(ASSET_ROOT_SCHEMA, asset);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }
}

module.exports = new AssetService();
