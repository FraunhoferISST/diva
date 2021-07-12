const { mongoDb, ObjectId } = require("../utils/mongoDb");
const {
  assetNotFoundError,
  assetAlreadyExistsError,
  linkAssetToItselfError,
} = require("../utils/errors");
const {
  validateJsonSchema,
} = require("../utils/validation/jsonSchemaValidation");
const { generateAssetId } = require("../utils/util");
const { generateHistoryEntity } = require("../utils/history");

const sanitizeAsset = ({ _id, ...rest }) => rest;

const assetExists = async (id, collection) =>
  (await collection.countDocuments({ id }, { limit: 1 })) !== 0;

const createProjection = (projectionQuery) => {
  const projectionObject = {};
  if (projectionQuery) {
    for (const field of projectionQuery.split(",")) {
      projectionObject[field] = true;
    }
  } else {
    projectionObject.entities = false;
  }
  return projectionObject;
};

const encodeCursor = (data) => Buffer.from(data, "utf8").toString("base64");
const decodeCursor = (data) => Buffer.from(data, "base64").toString();
const createNextPageQuery = (id) => ({ _id: { $lt: ObjectId(id) } });
const createNextCursor = async (currentDoc, collection) => {
  const nextDoc = await collection.findOne({
    _id: { $lt: ObjectId(currentDoc._id) },
  });
  return nextDoc ? encodeCursor(`${currentDoc._id}`) : undefined;
};

const createHistoryEntry = async (oldObj, newObj, actorId) => {
  const historyEntity = generateHistoryEntity(oldObj, newObj, actorId);
  return mongoDb.historyCollection.insertOne(historyEntity).catch((err) => {
    throw err;
  });
};

class AssetService {
  async init(dbName = "assetsDb") {
    await mongoDb.connect(dbName);
    this.collection = mongoDb.assetCollection;
    // this.collection.createIndex({ uniqueFingerprint: 1 }, { unique: true });
  }

  async createAsset(asset, actorId) {
    const newAsset = {
      ...asset,
      id: generateAssetId(),
      entityType: "asset",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      creatorId: actorId,
    };
    validateJsonSchema(newAsset);
    await this.collection.insertOne({ ...newAsset }).catch((err) => {
      if (err.code && err.code === 11000) {
        throw assetAlreadyExistsError;
      }
      throw err;
    });
    await createHistoryEntry({}, newAsset, actorId);
    return newAsset.id;
  }

  async deleteAsset(id) {
    if (await assetExists(id, this.collection)) {
      return this.collection.deleteOne({ id });
    }
    throw assetNotFoundError;
  }

  async getAssetById(id, query = {}) {
    if (await assetExists(id, this.collection)) {
      return sanitizeAsset(
        await this.collection.findOne({ id }, createProjection(query.fields))
      );
    }
    throw assetNotFoundError;
  }

  async updateAsset(id, asset, actorId) {
    validateJsonSchema(asset);
    const existingAsset = await this.getAssetById(id);
    await this.collection.replaceOne(
      { id },
      {
        ...asset,
        id,
        entityType: existingAsset.entityType,
        creatorId: existingAsset.creatorId,
        created: existingAsset.created,
        modified: new Date().toISOString(),
      },
      {
        upsert: true,
      }
    );
    await createHistoryEntry(existingAsset, asset, actorId);
    return asset.id;
  }

  async patchAsset(id, patch, actorId) {
    if (await assetExists(id, this.collection)) {
      const existingAsset = await this.getAssetById(id);
      const updatedAsset = {
        ...existingAsset,
        ...patch,
        id,
        entityType: existingAsset.entityType,
        creatorId: existingAsset.creatorId,
        created: existingAsset.created,
        modified: new Date().toISOString(),
      };
      validateJsonSchema(updatedAsset);
      return this.updateAsset(id, updatedAsset, actorId);
    }
    throw assetNotFoundError;
  }

  async linkEntity(assetId, entityId, actorId) {
    if (assetId === entityId) {
      throw linkAssetToItselfError;
    }
    const existingAsset = await this.getAssetById(assetId);
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
      await createHistoryEntry(existingAsset, sanitizeAsset(newAsset), actorId);
      return newAsset;
    }
    throw assetNotFoundError;
  }

  async unlinkEntity(assetId, entityId, actorId) {
    const existingAsset = await this.getAssetById(assetId);
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
      await createHistoryEntry(existingAsset, sanitizeAsset(newAsset), actorId);
      return newAsset;
    }
    throw assetNotFoundError;
  }

  async getAssets(query) {
    const { cursor, pageSize = 30, fields } = query;
    let dbQuery = {};
    if (cursor) {
      const prevId = decodeCursor(cursor);
      dbQuery = createNextPageQuery(prevId);
    }
    const parsedPageSize = parseInt(pageSize, 10);
    const assets = await this.collection
      .find(dbQuery)
      .project(createProjection(fields))
      .sort({ _id: -1 })
      .limit(parsedPageSize)
      .toArray();
    return {
      collectionSize: assets.length,
      collection: assets.map(sanitizeAsset),
      cursor:
        assets.length === parsedPageSize &&
        (await createNextCursor(assets[assets.length - 1], this.collection)),
    };
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
      };
    }
    throw assetNotFoundError;
  }
}

module.exports = new AssetService();
