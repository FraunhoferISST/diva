const { ObjectId } = require("mongodb");
const {
  createHistoryEntity,
  createPatchDelta,
} = require("@diva/common/createHistoryEntry");
const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");
const { logger } = require("@diva/common/logger");
const {
  entityAlreadyExistsError,
  entityNotFoundError,
  imagesLimitError,
} = require("@diva/common/Error");
const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const generateUuid = require("@diva/common/utils/generateUuid");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const entityImagesService = require("./EntityImagesService");
const {
  collectionsNames: { ENTITY_COLLECTION_NAME, HISTORIES_COLLECTION_NAME },
  entityTypes: { ENTITY },
} = require("../utils/constants");
const { serviceId } = require("../package.json");

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

const createProjectionObject = (projectionQuery, excludes) => {
  const projectionObject = {};
  if (projectionQuery) {
    for (const field of projectionQuery.split(",")) {
      projectionObject[field.trim()] = 1;
    }
  }
  return { ...projectionObject, ...excludes };
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
   * @param {String} entityType - the type of the entity, (e.g. resource, user, etc.)
   * @param {String} collectionName - the name of the mongo entity collection name (e.g. entities, etc.), defaults to "entities"
   */
  constructor(
    entityType,
    { collectionName = ENTITY_COLLECTION_NAME, defaultEntities = [] } = {}
  ) {
    this.entityType = entityType;
    this.collectionName = collectionName;
    this.defaultEntities = defaultEntities;
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
      "systemEntityType",
      "creatorId",
      "email",
      "username",
      "schemaName",
    ];
  }

  /**
   * @returns {Promise<void>}
   */
  async init() {
    await entityImagesService.init();
    this.collection = mongoDbConnector.collections[this.collectionName];
    this.historyCollection =
      mongoDbConnector.collections[HISTORIES_COLLECTION_NAME];
  }

  loadDefault() {
    logger.info(
      `Loading ${this.defaultEntities.length} default entities from type ${
        this.systemEntityType ?? this.entityType
      }`
    );
    return Promise.all(
      this.defaultEntities.map((entity) =>
        this.replace(entity.id, entity)
          .then(() =>
            this.historyCollection.insertOne(
              createHistoryEntity(
                entity.id,
                createPatchDelta({}, entity),
                serviceId
              )
            )
          )
          .catch((e) => {
            // already loaded, ignore
            if (e.code === 409) {
              return true;
            }
            throw e;
          })
      )
    );
  }

  validate(entity) {
    jsonSchemaValidator.validate(ENTITY_ROOT_SCHEMA, entity);
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }

  createEntityObject(entity = {}) {
    const entityType = this.entityType ?? entity.entityType;
    return cleanUpEntity({
      id: generateUuid(this.entityType ?? ENTITY), // the id can be overwritten by concrete implementation
      ...entity,
      entityType,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      entityImages: null,
    });
  }

  async create(entity, actorId) {
    const newEntity = this.createEntityObject(entity);
    this.validate(newEntity);
    await this.insert(newEntity);
    const delta = await this.createHistoryEntry({}, newEntity, actorId);
    return { id: newEntity.id, delta };
  }

  async get(queryParams, dbQuery = {}) {
    const { cursor, pageSize = 30, fields } = queryParams;
    const searchQueryParams = extractFilterQueryParams(
      this.filterParams,
      queryParams
    );
    const parsedPageSize = parseInt(pageSize, 10);
    const query = {
      entityType: this.entityType,
      ...createSearchQuery(searchQueryParams),
      ...dbQuery,
      ...(cursor ? createNextPageQuery(decodeCursor(cursor)) : {}),
    };
    const collection = await this.collection
      .find(query)
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
      collection: collection.map((e) => this.sanitizeEntity(e, queryParams)),
      cursor: nextCursor,
      total: await this.count(query),
    };
  }

  async getById(id, query = {}, policyPayload = {}) {
    const { fields } = query;
    if (await this.entityExists(id)) {
      return this.sanitizeEntity(
        await this.collection.findOne(
          { id },
          {
            projection: createProjectionObject(
              fields,
              policyPayload.projections
            ),
          }
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
      modifiedAt: new Date().toISOString(),
    });
    if (await this.entityExists(id)) {
      this.validate(updatedEntity);
      const existingEntity = await this.collection.findOne(
        { id },
        { projection: { _id: false } }
      );
      await this.replace(id, updatedEntity);
      const delta = await this.createHistoryEntry(
        existingEntity,
        updatedEntity,
        actorId
      );
      return { delta };
    }
    updatedEntity.createdAt = new Date().toISOString();
    this.validate(updatedEntity);
    await this.insert(updatedEntity);
    const delta = await this.createHistoryEntry({}, updatedEntity, actorId);
    return { delta };
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
        createdAt: existingEntity.createdAt,
        modifiedAt: new Date().toISOString(),
        entityImages: existingEntity.entityImages,
      });
      this.validate(updatedEntity);
      await this.replace(id, updatedEntity);
      const delta = await this.createHistoryEntry(
        existingEntity,
        updatedEntity,
        actorId
      );
      return { delta };
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
    const delta = createPatchDelta(oldObj, newObj);
    const historyEntry = createHistoryEntity(newObj.id, delta, actorId);
    jsonSchemaValidator.validate(ENTITY_ROOT_SCHEMA, historyEntry);
    return this.historyCollection.insertOne(historyEntry).then(() => delta);
  }

  count(query = {}) {
    return this.collection.countDocuments(query);
  }

  async addImage(id, imageFile, actorId) {
    const { entityImages } = await this.getById(id, { fields: "entityImages" });
    if (entityImages?.length >= 15) {
      // TODO: this should be handled through a policy
      throw imagesLimitError;
    }
    const newImageId = await entityImagesService.addImage(imageFile);
    await this.collection.updateOne(
      { id },
      { $addToSet: { entityImages: newImageId } }
    );
    return this.patchById(id, { entityImages }, actorId)
      .then(() => newImageId)
      .catch(async (e) => {
        this.collection.updateOne(
          { id },
          { $pull: { entityImages: newImageId } }
        );
        entityImagesService.deleteImageById(newImageId);
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
