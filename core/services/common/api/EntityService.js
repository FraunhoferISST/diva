const { ObjectId } = require("mongodb");
const createHistoryEntry = require("../createHistoryEntry");
const { decodeCursor, encodeCursor } = require("./cursor");
const { entityAlreadyExistsError, entityNotFoundError } = require("../Error");

const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

const createProjectionObject = (projectionQuery) => {
  const projectionObject = {};
  if (projectionQuery) {
    for (const field of projectionQuery.split(",")) {
      projectionObject[field] = 1;
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
  constructor() {
    this.collection = {}; // primary entity collection (users, resources...)
    this.historyCollection = {}; // collection for history entries
    this.jsonSchemaValidator = {}; // initialized JsonSchemaValidator instance
    /**
     * query parameters that can be use for filtering by default, the list can be extended with filterParams in child class
     */
    this.defaultFilterParams = ["belongsTo", "creatorId", "email", "username"];
  }

  init() {
    // Override to initialize collections in constructor
    throw Error(`Method "init" must be overwritten`);
  }

  validate(_entity) {
    // Override how to validate entity
    throw Error(
      `Method "validate" must be overwritten with "entity" parameter`
    );
  }

  sanitizeEntity({ _id, ...rest }) {
    return rest;
  }

  async create(entity, actorId) {
    const newEntity = {
      ...entity,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      creatorId: actorId,
    };
    this.validate(newEntity);
    await this.collection.insertOne(newEntity).catch((err) => {
      if (err.code && err.code === 11000) {
        throw entityAlreadyExistsError;
      }
      throw err;
    });
    await this.createHistoryEntry({}, newEntity, actorId);
    return newEntity.id;
  }

  async get(query) {
    const { cursor, pageSize = 30, fields } = query;
    const searchQueryParams = extractFilterQueryParams(
      [...this.defaultFilterParams, ...(this.filterParams ?? [])],
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
        ),
        query
      );
    }
    throw entityNotFoundError;
  }

  updateById(id, entity) {
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

  async patchById(id, patch, actorId) {
    if (await this.entityExists(id)) {
      const existingEntity = await this.collection.findOne(
        { id },
        { projection: { _id: false } }
      );
      const updatedEntity = {
        ...existingEntity,
        ...patch,
        id,
        entityType: existingEntity.entityType,
        creatorId: existingEntity.creatorId,
        created: existingEntity.created,
        modified: new Date().toISOString(),
      };
      this.validate(updatedEntity);
      await this.updateById(id, updatedEntity);
      return this.createHistoryEntry(existingEntity, updatedEntity, actorId);
    }
    throw entityNotFoundError;
  }

  async deleteById(id) {
    if (await this.entityExists(id)) {
      // TODO: delete history? --> HA listens to delete Events and does clean up
      return this.collection.deleteOne({ id });
    }
    throw entityNotFoundError;
  }

  async entityExists(id) {
    return (await this.collection.countDocuments({ id }, { limit: 1 })) !== 0;
  }

  createHistoryEntry(oldObj, newObj, actorId) {
    const history = createHistoryEntry(oldObj, newObj, actorId);
    this.jsonSchemaValidator.validate(HISTORY_ROOT_SCHEMA, history);
    return this.historyCollection.insertOne(history);
  }

  count() {
    return this.collection.countDocuments({});
  }
}

module.exports = EntityService;
