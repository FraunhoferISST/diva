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
    buildExtension: (user, refs) => ({
      id: shortenDivaId(user.id),
      name: "std:agent",
      payload: {
        name: user.username,
        mbox: user.email,
      },
      refs,
    }),
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
    if (mapping) {
      return mapping.buildExtension(destroySubject, resource);
    }
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
    if (mapping) {
      return mapping.buildExtension(user, refs);
    }
  }
  return {
    id: shortenDivaId(user.id),
    name: "diva:user",
    payload: {
      id: user.id,
    },
    refs,
  };
};

const mergeDestroyContactExtensions = (destroyContacts) => {
  const newDestroyContacts = [];
  destroyContacts.forEach((destroyContact) => {
    const existingDestroyContact = newDestroyContacts.find(
      (ndc) => ndc.id === destroyContact.id
    );
    if (existingDestroyContact) {
      existingDestroyContact.refs = [
        ...new Set([...existingDestroyContact.refs, ...destroyContact.refs]),
      ];
    } else {
      newDestroyContacts.push(destroyContact);
    }
  });
  return newDestroyContacts;
};

class DestroyClaimService extends EntityService {
  async init() {
    await super.init();
  }

  async resolveDestroyClaimOwners(destroyclaim, resolveDeep = false) {
    const { collection: destroyclaimOwnersEdges } =
      await DataNetworkService.getEdges({
        edgeTypes: ["isOwnerOf"],
        to: destroyclaim.id,
        fromNodeType: ["user"],
        toNodeType: ["destroyclaim"],
      });

    const destroyclaimOwners = await Promise.all(
      destroyclaimOwnersEdges.map(async (u) => {
        const user = await this.collection.findOne(
          {
            id: u.from.entityId,
          },
          { projection: { _id: false } }
        );
        if (user) {
          return buildDestroyContactExtension(
            user,
            [shortenDivaId(destroyclaim.id)],
            resolveDeep
          );
        }
        throw entityNotFoundError;
      })
    );

    return destroyclaimOwners;
  }

  async resolveDestroySubjectOwners(destroyclaim, resolveDeep = false) {
    const { collection: destroySubjectsEdges } =
      await DataNetworkService.getEdges({
        edgeTypes: ["isDestroySubjectOf"],
        to: destroyclaim.id,
        fromNodeType: ["destroyclaim"],
        toNodeType: ["destroyclaim"],
      });

    const destroySubjectsResource = await Promise.all(
      destroySubjectsEdges.map(async (u) => {
        const subject = await this.collection.findOne(
          {
            id: u.from.entityId,
          },
          { projection: { _id: false } }
        );
        if (subject) {
          const resource = await this.resolveResource(subject);
          return { subject, resource };
        }
        throw entityNotFoundError;
      })
    );

    const allData = await Promise.all(
      destroySubjectsResource.map(async (elem) => {
        const { collection: edges } = await DataNetworkService.getEdges({
          edgeTypes: ["isOwnerOf"],
          to: elem.resource.id,
          fromNodeType: ["user"],
          toNodeType: ["resource"],
        });

        const users = await Promise.all(
          edges.map(async (u) => {
            const res = await this.collection.findOne(
              {
                id: u.from.entityId,
              },
              { projection: { _id: false } }
            );
            if (res) {
              return res;
            }
            throw entityNotFoundError;
          })
        );

        return { ...elem, users };
      })
    );

    const destroyContactsResources = [
      ...allData.map((a) => [
        ...a.users.map((u) =>
          buildDestroyContactExtension(
            u,
            [shortenDivaId(a.subject.id)],
            resolveDeep
          )
        ),
      ]),
    ].flat();

    return destroyContactsResources;
  }

  async resolveDestroyContacts(destroyclaim, resolveDeep = false) {
    // resolve direct Owners
    const destroyclaimOwners = await this.resolveDestroyClaimOwners(
      destroyclaim,
      resolveDeep
    );

    // resolve destroySubject Owners
    const destroySubjectOwners = await this.resolveDestroySubjectOwners(
      destroyclaim,
      resolveDeep
    );

    const all = mergeDestroyContactExtensions([
      ...destroyclaimOwners,
      ...destroySubjectOwners,
    ]);

    return all.length > 0 ? all : undefined;
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
    const destroyContacts = await this.resolveDestroyContacts(destroyclaim);
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
      conditions: sanitizeConditions(destroyclaim.destroyclaimConditions),
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
