const {
  DestroyClaimValidator,
  SupportObjectGenerator,
} = require("@datebe/destroyclaim-js");
const {
  entityNotFoundError,
  customErrorFactory,
} = require("@diva/common/Error");
const { v4 } = require("uuid");
const DataNetworkService = require("./DataNetworkService");

const EntityService = require("./EntityService");
const {
  entityTypes: { DESTROY_CLAIM },
} = require("../utils/constants");

const support = new SupportObjectGenerator();
support.addSupportedVersion("1.0.0");
support.supportNormalMode();
support.supportStrictMode();
support.supportSilentMode();
support.supportNotificationMode();
support.supportAutomatedMode();
support.supportManualMode();
support.supportRealMode();
support.supportSimulationMode();
support.addSupportedDestroyReason([
  "std:reason:data-quality:accessibility:accessibility",
  "std:reason:data-quality:accessibility:access-security",
  "std:reason:data-quality:representational:concise-representation",
  "std:reason:data-quality:representational:representational-consistency",
  "std:reason:data-quality:representational:ease-of-understanding",
  "std:reason:data-quality:representational:interpretability",
  "std:reason:data-quality:contextual:appropriate-amount-of-data",
  "std:reason:data-quality:contextual:completeness",
  "std:reason:data-quality:contextual:timeliness",
  "std:reason:data-quality:contextual:relevancy",
  "std:reason:data-quality:contextual:value-added",
  "std:reason:data-quality:intrinsic:reputation",
  "std:reason:data-quality:intrinsic:believability",
  "std:reason:data-quality:intrinsic:objectivity",
  "std:reason:data-quality:intrinsic:accuracy",
  "std:reason:organizational:principles:green-it",
  "std:reason:organizational:principles:ethics",
  "std:reason:organizational:principles:moral",
  "std:reason:organizational:principles:fairness",
  "std:reason:organizational:economics:irrelevance",
  "std:reason:organizational:economics:lack-of-value",
  "std:reason:organizational:economics:save-costs",
  "std:reason:organizational:economics:save-time",
  "std:reason:technical:environment-focused:free-storage-space",
  "std:reason:technical:environment-focused:improve-efficacy",
  "std:reason:technical:environment-focused:improve-efficiency",
  "std:reason:technical:data-focused:corrupted",
  "std:reason:technical:data-focused:representation",
  "std:reason:technical:data-focused:invalid-data",
  "std:reason:compliance:laws-contracts:crime-illegal:betrayal-of-secrets",
  "std:reason:compliance:laws-contracts:crime-illegal:copyright",
  "std:reason:compliance:laws-contracts:data-protection:ccpa",
  "std:reason:compliance:laws-contracts:data-protection:dsgvo",
  "std:reason:compliance:laws-contracts:data-protection:gdpr",
  "std:reason:compliance:laws-contracts:nda",
  "std:reason:compliance:laws-contracts:expired-retention-period",
  "std:reason:compliance:laws-contracts:sla",
  "std:reason:compliance:standards:external:nist",
  "std:reason:compliance:standards:external:iso",
  "std:reason:compliance:standards:external:din",
  "std:reason:compliance:standards:internal:employee-guides",
  "std:reason:security:integrity-reliability:malicious-executable-data",
  "std:reason:security:integrity-reliability:malicious-data",
  "std:reason:security:integrity-reliability:unintended-changes",
  "std:reason:security:integrity-reliability:social-engineering:scareware",
  "std:reason:security:integrity-reliability:social-engineering:spam",
  "std:reason:security:integrity-reliability:social-engineering:phishing",
  "std:reason:security:confidentiality:change-of-scope",
  "std:reason:security:confidentiality:clear-traces",
  "std:reason:security:confidentiality:storage-location",
  "std:reason:security:confidentiality:missing-encryption",
  "std:reason:security:confidentiality:discard-sell-hardware",
]);

support.addDestroySubjectExtension(
  "std:sha256",
  {},
  {
    evaluation: () => {},
  },
  {
    realMode: () => {},
  }
);
support.addDestroySubjectExtension(
  "diva:resource",
  {},
  {
    evaluation: () => {},
  },
  {
    realMode: () => {},
  }
);
support.addDestroyContactExtension(
  "std:agent",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyContactExtension(
  "diva:user",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "std:fromPointInTime",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "std:toPointInTime",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "std:geoLocation",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "std:alpha3CountryCode",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "std:dcaProperty",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "diva:entityPropery",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyConditionExtension(
  "diva:entityRelation",
  {},
  {
    evaluation: () => {},
  }
);
support.addDestroyActionExtension(
  "std:destructionLevel",
  {},
  {
    evaluation: () => {},
  },
  {
    realMode: () => {},
  }
);

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
  action,
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
    action: action ? action.id : undefined,
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

const buildDestroyActionExtension = (action) => ({
  id: v4(),
  name: "std:destructionLevel",
  payload: {
    destructionLevel: action,
  },
});

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

  async resolveDestroySubjects(
    destroyclaim,
    destroyActions,
    resolveDeep = false
  ) {
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
          const action = destroyActions
            ? destroyActions.find(
                (a) => a.payload.destructionLevel === entity.destroyclaimAction
              )
            : undefined;
          return buildDestroySubjectExtension(
            entity,
            resource,
            action,
            resolveDeep
          );
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

    return destroyConditions.length > 0 ? destroyConditions : undefined;
  }

  async resolveDestroyActions(destroyclaim) {
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
          return entity;
        }
        throw entityNotFoundError;
      })
    );
    const destroyActions = [
      ...new Set(
        destroySubjects
          .filter((ds) => ds.destroyclaimAction)
          .map((ds) => ds.destroyclaimAction)
      ),
    ].map((a) => buildDestroyActionExtension(a));

    return destroyActions.length > 0 ? destroyActions : undefined;
  }

  async resolveDestroyClaim(destroyclaim, resolveDeep = false) {
    const destroyActions = await this.resolveDestroyActions(destroyclaim);
    const destroySubjects = await this.resolveDestroySubjects(
      destroyclaim,
      destroyActions,
      resolveDeep
    );
    const destroyContacts = await this.resolveDestroyContacts(
      destroyclaim,
      resolveDeep
    );
    const destroyConditions = await this.resolveDestroyConditions(destroyclaim);
    return {
      id: shortenDivaId(destroyclaim.id),
      isActive: destroyclaim.isActive || false,
      specVersion: destroyclaim.destroyclaimModelVersion,
      expires: destroyclaim.destroyclaimExpirationDate,
      strictMode: destroyclaim.destroyclaimStrictMode || false,
      simulationMode: destroyclaim.destroyclaimSimulationMode || false,
      notificationMode: destroyclaim.destroyclaimNotificationMode || false,
      optInMode: destroyclaim.destroyclaimManualMode || false,
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
      const resolvedDestroyClaim = JSON.parse(
        JSON.stringify(await this.resolveDestroyClaim(entity))
      );
      const validate = new DestroyClaimValidator(
        resolvedDestroyClaim,
        support.getSupportObject()
      );
      if (validate.validateDestroyClaim()) {
        return this.resolveDestroyClaim(entity);
      }

      throw customErrorFactory({
        type: "DestroyClaimNotValid",
        message:
          "Destroy Claim is currently not valid. Please contact Owner in DIVA",
        code: 500,
        errors: validate.getValidationErrors(),
      });
    }
    throw entityNotFoundError;
  }
}
module.exports = new DestroyClaimService(DESTROY_CLAIM);
