const { entityNotFoundError } = require("@diva/common/Error");
const DataNetworkService = require("./DataNetworkService");

const EntityService = require("./EntityService");
const {
  entityTypes: { DESTROY_CLAIM },
} = require("../utils/constants");

const shortenDivaId = (divaId) => divaId.split(":").pop();

const sanitizeConditions = (conditions) => {
  if (!conditions) {
    return undefined;
  }
  try {
    return JSON.parse(conditions);
  } catch (e) {
    throw new Error(
      "A condition of the Destroy Claim is not valid. Contact Admin."
    );
  }
};

const resolveDeepMapping = [
  {
    entityType: "resource",
    resourceType: "file",
    resolveDeep: "std:sha256",
    buildExtension: (destroySubject, resource) => ({
      id: shortenDivaId(destroySubject.id),
      name: "std:sha256",
      payload: {
        hash: resource.uniqueFingerprint,
      },
      conditions: sanitizeConditions(destroySubject.destroyclaimConditions),
    }),
  },
  {
    entityType: "user",
    resolveDeep: "std:agent",
    buildExtension: () => {
      
    },
  },
];

const buildDestroySubjectExtension = (
  destroySubject,
  resource,
  deepResolve = false
) => {
  if (deepResolve) {
    const mapping = resolveDeepMapping.find(
      (m) => m.resourceType === resource.resourceType
    );
    return mapping.buildExtension(destroySubject, resource);
  }
  return {
    id: shortenDivaId(destroySubject.id),
    name: "diva:resource",
    payload: {
      id: resource.id,
    },
    conditions: sanitizeConditions(destroySubject.destroyclaimConditions),
  };
};

const buildDestroyContactExtension = (user, refs, deepResolve = false) => {
  if (deepResolve) {
    const mapping = resolveDeepMapping.find(
      (m) => m.entityType === user.entityType
    );
    return mapping.buildExtension(destroyContact, user);
  }
  return {
    id: shortenDivaId(user.id),
    name: "diva:user",
    payload: {
      id: user.id,
    },
    refs: [shortenDivaId(destroyclaim.id)],
  };
};

class DestroyClaimService extends EntityService {
  async init() {
    await super.init();
  }

  async resolveOwnerOf(entity) {
    const { collection: edges } = await DataNetworkService.getEdges({
      edgeTypes: ["isOwnerOf"],
      to: entity.id,
      fromNodeType: ["user"],
      toNodeType: ["destroyclaim"],
    });

    const users = await Promise.all(
      edges.map(async (u) => {
        const res = await this.collection.findOne(
          {
            id: u.to.entityId,
          },
          { projection: { _id: false } }
        );
        if (res) {
          return res;
        }
        throw entityNotFoundError;
      })
    );

    return users;
  }

  async resolveDestroyContacts(destroyclaim, resolveDeep = false) {
    const { collection: destroyclaimOwnersEdges } =
      await DataNetworkService.getEdges({
        edgeTypes: ["isOwnerOf"],
        to: destroyclaim.id,
        fromNodeType: ["user"],
        toNodeType: ["destroyclaim"],
      });
    const { collection: destroySubjectsEdges } =
      await DataNetworkService.getEdges({
        edgeTypes: ["isDestroySubjectOf"],
        to: destroyclaim.id,
        fromNodeType: ["destroyclaim"],
        toNodeType: ["destroyclaim"],
      });

    const destroySubjectsContacts = await Promise.all(
      destroySubjectsEdges.map(async (u) => {
        const entity = await this.collection.findOne(
          {
            id: u.from.entityId,
          },
          { projection: { _id: false } }
        );
        if (entity) {
          const resource = await this.resolveResource(entity);
          const { collection: resourceOwnersEdges } =
            await DataNetworkService.getEdges({
              edgeTypes: ["isOwnerOf"],
              to: resource.id,
              fromNodeType: ["user"],
              toNodeType: ["resource"],
            });
          return {
            refId: shortenDivaId(entity.id),
            owners: resourceOwnersEdges,
          };
        }
        throw entityNotFoundError;
      })
    );

    const destroyclaimOwner = await this.resolveOwnerOf(destroyclaim);
    const destroyclaimOwnerExtensions = destroyclaimOwner.map((o) =>
      buildDestroyContactExtension(o, destroyclaim)
    );

    return contacts.length > 0 ? contacts : undefined;
  }

  async resolveResource(destroySubject) {
    const { collection: edges } = await DataNetworkService.getEdges({
      edgeTypes: ["refersTo"],
      from: destroySubject.id,
      fromNodeType: ["destroyclaim"],
      toNodeType: ["resource"],
    });

    const resource = await Promise.all(
      edges.map(async (u) => {
        const entity = await this.collection.findOne(
          {
            id: u.to.entityId,
          },
          { projection: { _id: false } }
        );
        if (entity) {
          return entity;
        }
        throw entityNotFoundError;
      })
    );

    return resource[0];
  }

  async resolveDestroySubjects(destroyclaim, resolveDeep = false) {
    const { collection: edges } = await DataNetworkService.getEdges({
      edgeTypes: ["isDestroySubjectOf"],
      to: destroyclaim.id,
      fromNodeType: ["destroyclaim"],
      toNodeType: ["destroyclaim"],
    });

    const destroySubjects = await Promise.all(
      edges.map(async (u) => {
        const entity = await this.collection.findOne(
          {
            id: u.from.entityId,
          },
          { projection: { _id: false } }
        );
        if (entity) {
          const resource = await this.resolveResource(entity);
          return buildDestroySubjectExtension(entity, resource, resolveDeep);
        }
        throw entityNotFoundError;
      })
    );

    return destroySubjects;
  }

  async resolveDestroyConditions(destroyclaim) {
    const { collection: edges } = await DataNetworkService.getEdges({
      edgeTypes: ["isDestroyConditionOf"],
      to: destroyclaim.id,
      fromNodeType: ["destroyclaim"],
      toNodeType: ["destroyclaim"],
    });

    const destroyConditions = await Promise.all(
      edges.map(async (u) => {
        const entity = await this.collection.findOne(
          {
            id: u.from.entityId,
          },
          { projection: { _id: false } }
        );
        if (entity) {
          return {
            id: shortenDivaId(entity.id),
            name: entity.destroyclaimExtensionName,
            payload: entity.destroyclaimExtensionPayload,
            conditions: sanitizeConditions(entity.destroyclaimConditions),
          };
        }
        throw entityNotFoundError;
      })
    );

    return destroyConditions;
  }

  async resolveDestroyActions(destroyclaim) {
    return undefined;
  }

  async resolveDestroyClaim(destroyclaim) {
    const destroySubjects = await this.resolveDestroySubjects(destroyclaim);
    const destroyContacts = await this.resolveDestroyContacts(
      destroyclaim,
      destroySubjects
    );
    const destroyConditions = await this.resolveDestroyConditions(destroyclaim);
    const destroyActions = await this.resolveDestroyActions(destroyclaim);
    return {
      id: shortenDivaId(destroyclaim.id),
      isActive: destroyclaim.isActive,
      modelVersion: destroyclaim.destroyclaimModelVersion,
      expirationDate: destroyclaim.destroyclaimExpirationDate,
      strictMode: destroyclaim.destroyclaimStrictMode,
      simulationMode: destroyclaim.destroyclaimSimulationMode,
      notificationMode: destroyclaim.destroyclaimNotificationMode,
      manualMode: destroyclaim.destroyclaimManualMode,
      issued: destroyclaim.createdAt,
      modified: destroyclaim.modifiedAt,
      title: destroyclaim.title,
      description: destroyclaim.description,
      keywords: destroyclaim.keywords,
      destroyReasons: destroyclaim.destroyclaimDestroyReasons?.map(
        (r) => r.value
      ),
      destroyContacts,
      destroySubjects,
      destroyConditions,
      destroyActions,
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
      return this.resolveDestroyClaim(entity);
    }
    throw entityNotFoundError;
  }
}
module.exports = new DestroyClaimService(DESTROY_CLAIM);
