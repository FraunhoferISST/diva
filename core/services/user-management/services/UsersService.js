const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const UserImagesService = require("./UserImagesService");
const {
  usersMongoDbConnector,
  historyMongoDbConnector,
} = require("../utils/mongoDbConnectors");

const { sanitizeUser, hashPassword } = require("../utils/user-helper");

const USER_ROOT_SCHEMA = process.env.USER_ROOT_SCHEMA || "user";
const usersCollectionName = process.env.MONGO_COLLECTION_NAME || "users";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const createUser = async (userData, actorId) => {
  const id = generateUuid("user");
  return {
    ...userData,
    id,
    entityType: "user",
    password: userData.password
      ? await hashPassword(userData.password)
      : undefined,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    creatorId: actorId || id,
  };
};

class UsersService extends EntityService {
  async init() {
    await historyMongoDbConnector.connect();
    await usersMongoDbConnector.connect();
    this.collection = usersMongoDbConnector.collections[usersCollectionName];
    await this.collection.createIndex({ email: 1 }, { unique: true });
    this.historyCollection =
      historyMongoDbConnector.collections[historyCollectionName];
    this.jsonSchemaValidator = jsonSchemaValidator;
  }

  async create(user, actorId) {
    const newUser = await createUser(user, actorId);
    return super.create(newUser, actorId || newUser.id);
  }

  async deleteById(id) {
    const user = await this.collection.findOne({ id });
    if (user) {
      if (user.imageId) {
        await UserImagesService.deleteImage(user.imageId).catch(() => "");
      }
    }
    return super.deleteById(id);
  }

  async updateById(id, user, actorId) {
    if (await this.entityExists(id)) {
      const existingUser = await this.collection.findOne(
        { id },
        { projection: { _id: false } }
      );
      return super.updateById(
        id,
        {
          ...existingUser,
          ...user,
        },
        actorId
      );
    }
    return super.updateById(id, await createUser(user), actorId);
  }

  async patchById(id, patch, actorId) {
    const userPatch = {
      ...patch,
      ...(patch.password
        ? { password: await hashPassword(patch.password) }
        : {}),
    };
    return super.patchById(id, userPatch, actorId);
  }

  validate(user) {
    jsonSchemaValidator.validate(USER_ROOT_SCHEMA, user);
  }

  sanitizeEntity(user) {
    return sanitizeUser(user);
  }
}

module.exports = new UsersService();
