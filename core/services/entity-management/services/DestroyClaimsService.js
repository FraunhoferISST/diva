const { entityNotFoundError } = require("@diva/common/Error");
const DataNetworkService = require("./DataNetworkService");

const EntityService = require("./EntityService");
const {
  entityTypes: { DESTROY_CLAIM },
} = require("../utils/constants");

const shortenDivaId = (divaId) => {
    return divaId.split(":").pop();
}

class DestroyClaimService extends EntityService {
  async init() {
    await super.init();
  }

  async #resolveDestroyContacts(destroyclaim) {
    const destroyclaimOwners = await DataNetworkService.getEdges({
      edgeTypes: ["isOwnerOf"],
      to: destroyclaim.id,
      fromNodeType: "user",
      toNodeType: "destroyclaim",
    });

    const contacts = await Promise.all(destroyclaimOwners.collection.map(async (u) => {
      const entity = await this.collection.findOne(
        {
          id: u.from.entityId,
        },
        { projection: { _id: false } }
      );
      if (entity) {
        return {
          id: shortenDivaId(entity.id),
          name: "std:agent",
          payload: {
            name: entity.username,
            mbox: entity.email,
          },
          refs: [shortenDivaId(destroyclaim.id)],
        };
      }
      throw entityNotFoundError;
    }));

    return contacts;
  }

  async #resolveDestroyClaim(destroyclaim) {
    return {
      id: shortenDivaId(destroyclaim.id),
      isActive: destroyclaim.isActive,
      modelVersion: destroyclaim.modelVersion,
      expirationDate: destroyclaim.destroyclaimExpirationDate,
      strictMode: destroyclaim.strictMode,
      simulationMode: destroyclaim.simulationMode,
      notificationMode: destroyclaim.notificationMode,
      manualMode: destroyclaim.manualMode,
      issued: destroyclaim.createdAt,
      modified: destroyclaim.modifiedAt,
      title: destroyclaim.title,
      description: destroyclaim.description,
      keywords: destroyclaim.keywords,
      destroyReasons: destroyclaim.destroyclaimDestroyReasons?.map((r) => r.value),
      destroyContacts: await this.#resolveDestroyContacts(destroyclaim),
    };
  }

  async getAndResolveById(id) {
    const entity = await this.collection.findOne(
      {
        id,
      },
      { projection: { _id: false } }
    );
    if (entity) {
      return this.#resolveDestroyClaim(entity);
    }
    throw entityNotFoundError;
  }
}
module.exports = new DestroyClaimService(DESTROY_CLAIM);
