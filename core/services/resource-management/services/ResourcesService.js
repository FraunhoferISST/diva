const { mongoDb, ObjectId } = require("../utils/mongoDb");
const {
  resourceNotFoundError,
  resourceAlreadyExistsError,
} = require("../utils/errors");
const {
  validateJsonSchema,
} = require("../utils/validation/jsonSchemaValidation");
const { generateResourceId } = require("../utils/util");
const { generateHistoryEntity } = require("../utils/history");

const sanitizeResource = ({ _id, ...rest }) => rest;

const resourceExists = async (id, collection) =>
  (await collection.countDocuments({ id }, { limit: 1 })) !== 0;

const createProjection = (projectionQuery) => {
  const projectionObject = {};
  if (projectionQuery) {
    for (const field of projectionQuery.split(",")) {
      projectionObject[field] = 1;
    }
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
  return mongoDb.historyCollection.insertOne(historyEntity);
};

class ResourcesService {
  async init() {
    await mongoDb.connect();
    this.collection = mongoDb.resourceCollection;
    this.collection.createIndex(
      { uniqueFingerprint: 1 },
      {
        unique: true,
        sparse: true,
      }
    );
  }

  async createResource(resource, actorId) {
    const newResource = {
      ...resource,
      id: generateResourceId(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      creatorId: actorId,
      entityType: "resource",
    };
    validateJsonSchema(newResource);
    await this.collection.insertOne({ ...newResource }).catch((err) => {
      if (err.code && err.code === 11000) {
        throw resourceAlreadyExistsError;
      }
      throw err;
    });
    await createHistoryEntry({}, newResource, actorId);
    return newResource.id;
  }

  async deleteResource(id) {
    if (await resourceExists(id, this.collection)) {
      // TODO: delete history? --> HA listens to delete Events and does clean up
      return this.collection.deleteOne({ id });
    }
    throw resourceNotFoundError;
  }

  async getResourceById(id, query = {}) {
    const { fields } = query;
    if (await resourceExists(id, this.collection)) {
      return sanitizeResource(
        await this.collection.findOne(
          { id },
          { projection: createProjection(fields) }
        )
      );
    }
    throw resourceNotFoundError;
  }

  async updateResource(id, resource, actorId) {
    validateJsonSchema(resource);
    const existingResource = await this.getResourceById(id);
    await this.collection.replaceOne(
      { id },
      { ...resource, id },
      {
        upsert: true,
      }
    );
    await createHistoryEntry(existingResource, resource, actorId);
    return resource.id;
  }

  async patchResource(id, patch, actorId) {
    if (await resourceExists(id, this.collection)) {
      const existingResource = await this.getResourceById(id);
      const updatedResource = {
        ...existingResource,
        ...patch,
        id,
        entityType: existingResource.entityType,
        creatorId: existingResource.creatorId,
        created: existingResource.created,
        modified: new Date().toISOString(),
      };
      validateJsonSchema(updatedResource);
      return this.updateResource(id, updatedResource, actorId);
    }
    throw resourceNotFoundError;
  }

  async getResources(query) {
    const { cursor, pageSize = 30, fields } = query;
    let dbQuery = {};
    if (cursor) {
      const prevId = decodeCursor(cursor);
      dbQuery = createNextPageQuery(prevId);
    }
    const parsedPageSize = parseInt(pageSize, 10);
    const resources = await this.collection
      .find(dbQuery)
      .project(createProjection(fields))
      .sort({ _id: -1 })
      .limit(parsedPageSize)
      .toArray();
    let nextCursor;
    if (resources.length === parsedPageSize) {
      nextCursor = await createNextCursor(
        resources[resources.length - 1],
        this.collection
      );
    }
    return {
      collectionSize: resources.length,
      collection: resources.map(sanitizeResource),
      cursor: nextCursor,
    };
  }
}

module.exports = new ResourcesService();
