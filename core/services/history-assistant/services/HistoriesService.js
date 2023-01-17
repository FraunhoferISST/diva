const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");
const { ObjectId } = require("mongodb");
const { entityNotFoundError } = require("@diva/common/Error");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const { HISTORIES_COLLECTION_NAME } = require("../utils/constants");
const { deltaToHumanReadable } = require("../utils/deltaToHumanReadable");

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
const createNextCursor = async (currentDoc, collection, query) => {
  const nextDoc = await collection.findOne({
    ...query,
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

class HistoriesService {
  constructor() {
    this.entityType = "history";
    this.filterParams = ["attributedTo", "creatorId"];
  }

  async init() {
    this.collection = mongoDbConnector.collections[HISTORIES_COLLECTION_NAME];
  }

  sanitizeEntity({ _id, ...rest }, { humanReadable }) {
    return {
      ...rest,
      human: humanReadable && deltaToHumanReadable(rest.delta),
    };
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
        this.collection,
        query
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

  async entityExists(id) {
    return (await this.collection.countDocuments({ id }, { limit: 1 })) !== 0;
  }

  count(query = {}) {
    return this.collection.countDocuments(query);
  }
}

module.exports = new HistoriesService();
