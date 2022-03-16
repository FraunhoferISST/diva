const { ObjectId } = require("mongodb");
const createHistoryEntry = require("@diva/common/createHistoryEntry");
const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");
const {
  entityAlreadyExistsError,
  entityNotFoundError,
  imagesLimitError,
} = require("@diva/common/Error");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const generateUuid = require("@diva/common/generateUuid");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const entityImagesService = require("./EntityImagesService");
const { collectionNames } = require("../utils/constants");

const ENTITY_ROOT_SCHEMA = process.env.ENTITY_ROOT_SCHEMA || "entity";

const cleanUpEntity = (entity) => {
  let cleanEntity = {};
  for (const [k, v] of Object.entries(entity)) {
    if (v !== null && v !== undefined)
      if (!Array.isArray(v) && typeof v === "object") {
        if (Object.keys(v).length > 0) {
          cleanEntity = {
            ...cleanEntity,
            ...(Object.keys(cleanUpEntity(v)).length > 0
              ? { [k]: cleanUpEntity(v) }
              : {}),
          };
        }
      } else if (Array.isArray(v)) {
        const cleanArray = v.filter((elem) => elem);
        if (cleanArray.length > 0) {
          cleanEntity[k] = cleanArray;
        }
      } else {
        cleanEntity[k] = v;
      }
  }
  return cleanEntity;
};

const createProjectionObject = (projectionQuery) => {
  const projectionObject = {};
  if (projectionQuery) {
    for (const field of projectionQuery.split(",")) {
      projectionObject[field.trim()] = 1;
    }
  }
  return projectionObject;
};

const createNextPageQuery = (id) => ({ _id: { $lt: ObjectId(id) } });
const createNextCursor = async (currentDoc, collection) => {
  const nextDoc = await collection.findOne({
    _id: { $lt: ObjectId(currentDoc._id) },
  });
  return nextDoc ? encodeCursor(`${currentDoc._id}`) : undefined;
};

const extractFilterQueryParams = (filterParams, query) =>
  Object.fromEntries(
    filterParams.map((p) => [p, query[p]]).filter(([_, v]) => v)
  );

const createSearchQuery = (searchParams) =>
  Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      { $regex: new RegExp(`${value}`, "i") },
    ])
  );

class EntityService {
  /**
   * @param entityType - the type of the entity, (e.g. resource, user, etc.)
   */
  constructor(entityType, entityCollectionName) {
    this.entityType = entityType;
    this.entityCollectionName = entityCollectionName;
    /**
     * @type {{}} - primary MongoDb entity collection (users, resources...)
     */
    this.collection = {}; // primary entity collection (users, resources...)
    this.historyCollection = {}; // collection for history entries
    /**
     * query parameters that can be used for filtering by default
     */
    this.filterParams = [
      "attributedTo",
      "title",
      "entityType",
      "creatorId",
      "email",
      "username",
    ];
  }

  /**
   * @returns {Promise<void>}
   */
  async init() {
    await entityImagesService.init();
    this.collection = mongoDbConnector.collections[this.entityCollectionName];
    this.historyCollection =
      mongoDbConnector.collections[collectionNames.HISTORIES_COLLECTION_NAME];
  }

  validate(entity) {
    jsonSchemaValidator.validate(ENTITY_ROOT_SCHEMA, entity);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }

  async create(entity, actorId) {
    const newEntity = cleanUpEntity({
      ...entity,
      id: generateUuid(this.entityType),
      entityType: this.entityType,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      creatorId: actorId,
      entityImages: null,
    });
    this.validate(newEntity);
    await this.insert(newEntity);
    await this.createHistoryEntry({}, newEntity, actorId);
    return newEntity.id;
  }

  async get(query) {
    const { cursor, pageSize = 30, fields } = query;
    const searchQueryParams = extractFilterQueryParams(
      this.filterParams,
      query
    );
    const parsedPageSize = parseInt(pageSize, 10);
    let dbQuery = {};
    if (cursor) {
      const prevId = decodeCursor(cursor);
      dbQuery = createNextPageQuery(prevId);
    }
    const collection = await this.collection
      .find({
        entityType: this.entityType,
        ...createSearchQuery(searchQueryParams),
        ...dbQuery,
      })
      .project(createProjectionObject(fields))
      .sort({ _id: -1 })
      .limit(parsedPageSize)
      .toArray();
    let nextCursor;

    if (collection.length === parsedPageSize) {
      nextCursor = await createNextCursor(
        collection[collection.length - 1],
        this.collection
      );
    }
    return {
      collectionSize: collection.length,
      collection: collection.map((e) => this.sanitizeEntity(e, query)),
      cursor: nextCursor,
      total: await this.count(),
    };
  }

  async getById(id, query = {}) {
    const { fields } = query;
    if (await this.entityExists(id)) {
      return this.sanitizeEntity(
        await this.collection.findOne(
          { id },
          { projection: createProjectionObject(fields) }
        )
      );
    }
    throw entityNotFoundError;
  }

  replace(id, entity) {
    return this.collection
      .replaceOne({ id }, entity, {
        upsert: true,
      })
      .catch((err) => {
        if (err.code && err.code === 11000) {
          throw entityAlreadyExistsError;
        }
        throw err;
      });
  }

  insert(entity) {
    return this.collection.insertOne(entity).catch((err) => {
      if (err.code && err.code === 11000) {
        throw entityAlreadyExistsError;
      }
      throw err;
    });
  }

  async updateById(id, entity, actorId) {
    const updatedEntity = cleanUpEntity({
      ...entity,
      id,
      modified: new Date().toISOString(),
    });
    if (await this.entityExists(id)) {
      this.validate(updatedEntity);
      const existingEntity = await this.collection.findOne(
        { id },
        { projection: { _id: false } }
      );
      await this.replace(id, updatedEntity);
      return this.createHistoryEntry(existingEntity, updatedEntity, actorId);
    }
    updatedEntity.created = new Date().toISOString();
    this.validate(updatedEntity);
    await this.insert(updatedEntity);
    return this.createHistoryEntry({}, updatedEntity, actorId);
  }

  async patchById(id, patch, actorId) {
    if (await this.entityExists(id)) {
      const existingEntity = await this.collection.findOne(
        { id },
        { projection: { _id: false } }
      );
      const updatedEntity = cleanUpEntity({
        ...existingEntity,
        ...patch,
        id,
        entityType: existingEntity.entityType,
        creatorId: existingEntity.creatorId,
        created: existingEntity.created,
        modified: new Date().toISOString(),
        entityImages: existingEntity.entityImages,
      });
      this.validate(updatedEntity);
      await this.replace(id, updatedEntity);
      return this.createHistoryEntry(existingEntity, updatedEntity, actorId);
    }
    throw entityNotFoundError;
  }

  async deleteById(id) {
    if (await this.entityExists(id)) {
      const { entityImages } = await this.getById(id, {
        fields: "entityImages",
      });
      await this.collection.deleteOne({ id });
      return (
        entityImagesService
          .deleteImages(entityImages ?? [])
          // TODO: difficult case, for now we just log the error
          .catch((e) => console.warn(e))
      );
    }
    throw entityNotFoundError;
  }

  async entityExists(id) {
    return (await this.collection.countDocuments({ id }, { limit: 1 })) !== 0;
  }

  createHistoryEntry(oldObj, newObj, actorId) {
    const history = createHistoryEntry(oldObj, newObj, actorId);
    jsonSchemaValidator.validate(ENTITY_ROOT_SCHEMA, history);
    return this.historyCollection.insertOne(history);
  }

  count() {
    return this.collection.countDocuments({});
  }

  async addImage(id, imageFile, actorId) {
    const { entityImages } = await this.getById(id, { fields: "entityImages" });
    if (entityImages?.length >= 15) {
      throw imagesLimitError;
    }
    const newImageId = await entityImagesService.addImage(imageFile);
    this.collection.updateOne(
      { id },
      { $addToSet: { entityImages: newImageId } }
    );
    return this.patchById(id, {}, actorId)
      .then(() => newImageId)
      .catch(async (e) => {
        await entityImagesService.deleteImageById(newImageId);
        throw e;
      });
  }

  async getImageById(imageId) {
    return entityImagesService.getImageById(imageId);
  }

  async deleteImageById(id, imageId, actorId) {
    await entityImagesService.deleteImageById(imageId);
    this.collection.updateOne({ id }, { $pull: { entityImages: imageId } });
    return this.patchById(id, {}, actorId);
  }
}

module.exports = EntityService;
