const { v4 } = require("uuid");
const UserImagesService = require("./UserImagesService");
const { db, ObjectId } = require("../utils/database");
const {
  validateJsonSchema,
} = require("../utils/validation/jsonSchemaValidation");
const {
  userAlreadyExistsError,
  userNotFoundError,
} = require("../utils/errors");
const { sanitizeUser, hashPassword } = require("../utils/user-helper");
const { generateHistoryEntity } = require("../utils/history");

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

const isEmailFree = async (email) =>
  (await db.usersCollection.countDocuments({ email }, { limit: 1 })) === 0;

const createUser = async (userData, actorId) => {
  if (await isEmailFree(userData.email)) {
    const id = `user:uuid:${v4()}`;
    const newUser = {
      ...userData,
      id,
      entityType: "user",
      password: await hashPassword(userData.password),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      creatorId: actorId || id
    };
    validateJsonSchema(newUser);
    await db.usersCollection.insertOne(newUser);
    await createHistoryEntry({}, newUser, actorId || id);
    return newUser;
  }
  throw userAlreadyExistsError;
};

const encodeCursor = (data) => Buffer.from(data, "utf8").toString("base64");
const decodeCursor = (data) => Buffer.from(data, "base64").toString();
const createNextPageQuery = (id) => ({ _id: { $lt: ObjectId(id) } });
const createNextCursor = async (currentDoc) => {
  const nextDoc = await db.usersCollection.findOne({
    _id: { $lt: ObjectId(currentDoc._id) },
  });
  return nextDoc ? encodeCursor(`${currentDoc._id}`) : undefined;
};

const createHistoryEntry = async (oldObj, newObj, actorId) => {
  const historyEntity = generateHistoryEntity(oldObj, newObj, actorId);
  return db.historyCollection.
  insertOne(historyEntity)
    .catch((err) => {
      throw err;
    });
};

class UsersService {
  async createUser(user, actorId) {
    const newUser = await createUser(user, actorId);
    return newUser.id;
  }

  async deleteUser(id) {
    const user = await db.usersCollection.findOne({ id });
    if (user) {
      if (user.imageId) {
        await UserImagesService.deleteImage(user.imageId).catch(() => "");
      }
      return db.usersCollection.deleteOne({ id });
    }
    throw userNotFoundError;
  }

  async getUsers(query) {
    const { cursor, pageSize = 30, fields } = query;
    const parsedPageSize = parseInt(pageSize, 10);
    let dbQuery = {};
    if (cursor) {
      const prevId = decodeCursor(cursor);
      dbQuery = createNextPageQuery(prevId);
    }
    const collection = await db.usersCollection
      .find(dbQuery)
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
      collection: collection.map(sanitizeUser),
      cursor: nextCursor,
    };
  }

  async getUserById(id, query) {
    const { fields } = query;
    const user = await db.usersCollection.findOne(
      { id },
      { projection: createProjectionObject(fields) }
    );
    if (user) {
      return sanitizeUser(user);
    }
    throw userNotFoundError;
  }

  async updateUser(id, updateData, actorId) {
    const currentUser = await db.usersCollection.findOne({ id });
    if (
      updateData.email !== currentUser?.email &&
      !(await isEmailFree(updateData.email))
    ) {
      throw userAlreadyExistsError;
    }
    const updatedUser = {
      id,
      ...updateData,
      modified: new Date().toISOString(),
      password: await hashPassword(updateData.password),
    };
    validateJsonSchema(updatedUser);
    await db.usersCollection.replaceOne({ id }, updatedUser, {
      upsert: true,
    });
    await createHistoryEntry(currentUser, updatedUser, actorId);
    return updatedUser;
  }

  async patchUser(id, patch, actorId) {
    const currentUser = await db.usersCollection.findOne(
      { id },
      { projection: { _id: false } }
    );
    if (currentUser) {
      if (
        patch.email &&
        patch.email !== currentUser.email &&
        !(await isEmailFree(patch.email))
      ) {
        throw userAlreadyExistsError;
      }
      const updatedUser = {
        ...currentUser,
        ...patch,
        id,
        password: patch.password
          ? await hashPassword(patch.password)
          : currentUser.password,
        modified: new Date().toISOString(),
      };
      validateJsonSchema(updatedUser);
      await db.usersCollection.replaceOne({ id }, updatedUser, {
        upsert: false,
      });
      await createHistoryEntry(currentUser, updatedUser, actorId);
      return updatedUser;
    }
    throw userNotFoundError;
  }
}

module.exports = new UsersService();
