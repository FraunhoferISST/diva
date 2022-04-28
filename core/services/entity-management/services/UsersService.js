const generateUuid = require("@diva/common/utils/generateUuid");
const { logger: log } = require("@diva/common/logger");
const EntityService = require("./EntityService");
const { serviceId } = require("../package.json");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const {
  collectionsNames: { ENTITY_COLLECTION_NAME },
  entityTypes: { USER },
} = require("../utils/constants");

const createUser = (userData) => ({
  ...userData,
  id: userData.id || generateUuid("user"),
  entityType: "user",
});

class UsersService extends EntityService {
  async init() {
    await super.init();
    const email = process.env.ADMIN_EMAIL;
    if (
      email &&
      (await mongoDbConnector.collections[
        ENTITY_COLLECTION_NAME
      ].countDocuments(
        {
          entityType: this.entityType,
          email,
        },
        { limit: 1 }
      )) === 0
    ) {
      log.info(`Creating default admin user ${email}`);
      await this.create(
        { email, username: email.split("@")[0], roles: ["admin"] },
        serviceId
      );
    }
    return this.collection.createIndex(
      { email: 1 },
      { unique: true, partialFilterExpression: { entityType: this.entityType } }
    );
  }

  async create(user, actorId) {
    const newUser = createUser(user, actorId);
    return super.create(newUser, actorId || newUser.id);
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
          username: existingUser.username ?? user.username,
        },
        actorId
      );
    }
    return super.updateById(id, createUser(user), actorId);
  }
}

module.exports = new UsersService(USER);
