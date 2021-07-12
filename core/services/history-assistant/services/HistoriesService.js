const { db, ObjectId } = require("../utils/database");
const { historyNotFoundError } = require("../utils/errors");
const {
  sanitizeHistory,
  deltaToHumanReadable,
} = require("../utils/history-helper");

const createProjectionObject = (projectionQuery) => {
  const projectionObject = {};
  if (!projectionQuery) {
    return projectionObject;
  }
  for (const field of projectionQuery.split(",")) {
    projectionObject[field] = 1;
  }
  return projectionObject;
};

const encodeCursor = (data) => Buffer.from(data, "utf8").toString("base64");
const decodeCursor = (data) => Buffer.from(data, "base64").toString();
const createNextPageQuery = (id) => ({ _id: { $lt: ObjectId(id) } });
const createNextCursor = async (currentDoc) => {
  const nextDoc = await db.historiesCollection.findOne({
    _id: { $lt: ObjectId(currentDoc._id) },
  });
  return nextDoc ? encodeCursor(`${currentDoc._id}`) : undefined;
};

const prepareHistoryLog = (historyLog, humanReadable = false) => ({
  ...sanitizeHistory(historyLog),
  human: humanReadable && deltaToHumanReadable(historyLog.delta),
});

class HistoriesService {
  async getHistories(query) {
    const {
      cursor,
      pageSize = 30,
      fields,
      belongsTo = "",
      humanReadable,
    } = query;
    const parsedPageSize = parseInt(pageSize, 10);
    let dbQuery = {};
    if (cursor) {
      const prevId = decodeCursor(cursor);
      dbQuery = createNextPageQuery(prevId);
    }
    const collection = await db.historiesCollection
      .find({
        belongsTo: { $regex: new RegExp(`${belongsTo}`, "i") },
        ...dbQuery,
      })
      .project(createProjectionObject(fields))
      .sort({ _id: -1 })
      .limit(parsedPageSize)
      .toArray();
    let nextCursor;

    if (collection.length === parsedPageSize) {
      nextCursor = await createNextCursor(collection[collection.length - 1]);
    }
    return {
      collectionSize: collection.length,
      collection: collection.map((h) => prepareHistoryLog(h, humanReadable)),
      cursor: nextCursor,
    };
  }

  async getHistoryById(id, query) {
    const { fields, humanReadable } = query;
    const historyLog = await db.historiesCollection.findOne(
      { id },
      { projection: createProjectionObject(fields) }
    );
    if (historyLog) {
      return prepareHistoryLog(historyLog, humanReadable);
    }
    throw historyNotFoundError;
  }
}

module.exports = new HistoriesService();
