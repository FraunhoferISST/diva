const { entityNotFoundError } = require("@diva/common/Error");
const EntityService = require("./EntityService");
const {
  entityTypes: { DESTROY_CLAIM },
} = require("../utils/constants");

const resolveDestroyClaim = (destroyclaim) => ({
  id: destroyclaim.id.split(":").pop(),
  isActive: destroyclaim.isActive,
  modelVersion: destroyclaim.modelVersion,
  issued: destroyclaim.createdAt,
  modified: destroyclaim.modifiedAt,
});

class DestroyClaimService extends EntityService {
  async init() {
    await super.init();
  }

  async getAndResolveById(id) {
    const entity = await this.collection.findOne(
      {
        id,
      },
      { projection: { _id: false } }
    );
    if (entity) {
      return resolveDestroyClaim(entity);
    }
    throw entityNotFoundError;
  }
}
module.exports = new DestroyClaimService(DESTROY_CLAIM);
