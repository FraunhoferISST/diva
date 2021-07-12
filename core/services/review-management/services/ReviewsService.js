const { v4 } = require("uuid");
const { db, ObjectId } = require("../utils/database");
const {
  validateJsonSchema,
} = require("../utils/validation/jsonSchemaValidation");
const { generateHistoryEntity } = require("../utils/history");
const {
  alreadyWroteReviewError,
  reviewNotFound,
  notReviewAuthorError,
} = require("../utils/errors");

const sanitizeReview = ({ _id, ...rest }) => rest;

const encodeCursor = (data) => Buffer.from(data, "utf8").toString("base64");
const decodeCursor = (data) => Buffer.from(data, "base64").toString();
const createNextPageQuery = (id) => ({ _id: { $lt: ObjectId(id) } });
const createNextCursor = async (currentDoc) => {
  const nextDoc = await db.reviewsCollection.findOne({
    _id: { $lt: ObjectId(currentDoc._id) },
  });
  return nextDoc ? encodeCursor(`${currentDoc._id}`) : undefined;
};

const createHistoryEntry = async (oldObj, newObj, actorId) => {
  const historyEntity = generateHistoryEntity(oldObj, newObj, actorId);
  return db.historyCollection.insertOne(historyEntity).catch((err) => {
    throw err;
  });
};

class ReviewsService {
  async init(dbName) {
    await db.connect(dbName);
    this.collection = db.reviewsCollection;
  }

  async createReview(review, actorId) {
    const currentDate = new Date().toISOString();
    const newReview = {
      ...review,
      id: `review:uuid:${v4()}`,
      entityType: "review",
      created: currentDate,
      modified: currentDate,
      creatorId: actorId,
    };
    validateJsonSchema(newReview);
    return this.collection
      .insertOne(newReview)
      .then(() => {
        createHistoryEntry({}, newReview, actorId);
        return newReview.id;
      })
      .catch((err) => {
        if (err.code && err.code === 11000) {
          throw alreadyWroteReviewError;
        }
        throw err;
      });
  }

  async deleteReview(id, actorId) {
    const existingReview = await this.collection.findOne({ id });
    if (existingReview) {
      if (actorId === existingReview.creatorId) {
        await this.collection.deleteOne({ id });
        return existingReview;
      }
      throw notReviewAuthorError;
    }
    throw reviewNotFound;
  }

  async getReviews(query) {
    const { cursor, pageSize = 30, creatorId = "", belongsTo = "" } = query;
    const parsedPageSize = parseInt(pageSize, 10);
    let dbQuery = {};
    if (cursor) {
      const prevId = decodeCursor(cursor);
      dbQuery = createNextPageQuery(prevId);
    }
    const collection = await this.collection
      .find({
        creatorId: { $regex: new RegExp(`${creatorId}`, "i") },
        belongsTo: { $regex: new RegExp(`${belongsTo}`, "i") },
        ...dbQuery,
      })
      .sort({ _id: -1 })
      .limit(parsedPageSize)
      .toArray();
    let nextCursor;

    if (collection.length === parsedPageSize) {
      nextCursor = await createNextCursor(collection[collection.length - 1]);
    }
    return {
      collectionSize: collection.length,
      collection: collection.map(sanitizeReview),
      cursor: nextCursor,
    };
  }

  async getReviewById(id) {
    const review = await this.collection.findOne({ id });
    if (review) {
      return sanitizeReview(review);
    }
    throw reviewNotFound;
  }

  async patchReview(id, patch, actorId) {
    const existingReview = await this.collection.findOne(
      { id },
      { projection: { _id: false } }
    );
    if (existingReview) {
      if (actorId === existingReview.creatorId) {
        const updatedReview = {
          ...existingReview,
          ...patch,
          id,
          entityType: existingReview.entityType,
          creatorId: existingReview.creatorId,
          belongsTo: existingReview.belongsTo,
          created: existingReview.created,
          modified: new Date().toISOString(),
        };
        validateJsonSchema(updatedReview);
        await this.collection.replaceOne({ id }, updatedReview, {
          upsert: false,
        });
        await createHistoryEntry(existingReview, updatedReview, actorId);
        return updatedReview;
      }
      throw notReviewAuthorError;
    }
    throw reviewNotFound;
  }
}

module.exports = new ReviewsService();
