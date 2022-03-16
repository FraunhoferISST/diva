const generateUuid = require("@diva/common/generateUuid");
const EntityService = require("./EntityService");
const UserImagesService = require("./EntityImagesService");
const { entities } = require("../utils/constants");

const createUser = async (userData, actorId) => {
  const id = generateUuid("user");
  return {
    ...userData,
    id,
    entityType: "user",
    creatorId: actorId || id,
  };
};

class UsersService extends EntityService {
  async init() {
    this.entityType = entities.USERS.type;
    this.entityCollectionName = entities.USERS.collection;

    await super.init();
    await this.collection.createIndex(
      { email: 1 },
      { unique: true, partialFilterExpression: { entityType: this.entityType } }
    );
  }

  async create(user, actorId) {
    const newUser = await createUser(user, actorId);
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
    return super.updateById(id, await createUser(user), actorId);
  }
}

module.exports = new UsersService("user");
