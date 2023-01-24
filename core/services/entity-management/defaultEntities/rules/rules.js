module.exports = [
  {
    id: "rule:uuid:2952b934-39c8-4d18-a09b-b9a1a73ff908",
    title: "Connect creator with the created node",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "entity.events",
      "payload.type": "create",
      "payload.object.id": "[a-zA-Z]+:.*",
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "POST",
        endpoint: "{{entity-management}}/edges",
        body: {
          from: "{{payload.actor.id}}",
          to: "{{payload.object.id}}",
          edgeType: "isCreatorOf",
        },
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ], // in some cases it makes sense to ignore error, for example if the node/edge already exists
      },
    ],
  },
  {
    id: "rule:uuid:c5a20500-8d61-4ae5-acc5-d66ff73e882f",
    title: "Connect a review with the corresponding entity on review creation",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "entity.events",
      "payload.attributedTo[0].object.id": "[a-zA-Z]+:.*",
      "payload.type": "create",
      "payload.object.id": "review:.*",
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "POST",
        endpoint: "{{entity-management}}/edges",
        body: {
          from: "{{payload.object.id}}",
          to: "{{payload.attributedTo[0].object.id}}",
          edgeType: "isReviewOf",
        },
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:8622b14e-6ad4-4083-8748-2d0ea462a7ee",
    title: "Delete review if corresponding entity was deleted",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "datanetwork.events",
      "payload.type": "delete",
      "payload.object.id": "edge:.*",
      "payload.attributedTo[0].object.id": "review:.*",
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:review {id:'{{payload.attributedTo[0].object.id}}'})-[:isReviewOf]->(entity) RETURN (count(entity)=0) as ruleMet",
          },
        },
      ],
    },
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "DELETE",
        endpoint:
          "{{entity-management}}/reviews/{{payload.attributedTo[0].object.id}}",
        ignoreErrors: [
          {
            statusCode: 404, // already deleted, ignore it
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:b70e3c52-20d6-49f0-860d-b63d6a6b9501",
    title: "Trigger Similarity Hash DAG when Keywords change",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "entity.events",
      "payload.type": "update",
      "payload.object.affectedFields": '("keywords")', // arrays will be stringified. You can then use RegEx to perform checks.
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{serviceId}}" },
        },
        method: "POST",
        endpoint: "{{profiling-assistant}}/profiling/run/keywords_similarity",
        body: {
          entityId: "{{payload.object.id}}",
        },
        ignoreErrors: [
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:89d95d13-5f41-4ec6-a75c-2ff75b671edc",
    title: "Trigger GDPR Relevancy Forwarder when gdprRelevancy field change",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "entity.events",
      "payload.type": "update",
      "payload.object.affectedFields": '("gdprRelevancy")',
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{serviceId}}" },
        },
        method: "POST",
        endpoint: "{{profiling-assistant}}/profiling/run/property_forwarder",
        body: {
          entityId: "{{payload.object.id}}",
          patchedProperty: "gdprRelevancy",
        },
        ignoreErrors: [
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:3625de58-9028-4f0b-ad65-6d60d4296250",
    title:
      "Connect a Destroy Subject with the corresponding entity on creation",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "entity.events",
      "payload.attributedTo[0].object.id": "destroyclaim:.*",
      "payload.attributedTo[1].object.id": "resource:.*",
      "payload.type": "create",
      "payload.object.id": "destroyclaim:.*",
    },
    condition: {
      and: [
        {
          mongo: {
            query: {
              id: "{{payload.object.id}}",
              destroyclaimType: "destroySubject",
            },
          },
        },
      ],
    },
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "POST",
        endpoint: "{{entity-management}}/edges",
        body: {
          from: "{{payload.object.id}}",
          to: "{{payload.attributedTo[0].object.id}}",
          edgeType: "isDestroySubjectOf",
        },
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "POST",
        endpoint: "{{entity-management}}/edges",
        body: {
          from: "{{payload.object.id}}",
          to: "{{payload.attributedTo[1].object.id}}",
          edgeType: "refersTo",
        },
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:3625de58-9028-4f0b-ad65-6d60d4296250",
    title:
      "Remove a Destroy Subject when Destroy Claim or Resource was deleted",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "datanetwork.events",
      "payload.type": "delete",
      "payload.object.id": "edge:.*",
      "payload.attributedTo[0].object.id": "destroyclaim:.*", // destroySubject
      "payload.attributedTo[1].object.id": "(destroyclaim:.*|resource:.*)",
    },
    condition: {
      or: [
        {
          cypher: {
            query:
              "MATCH (n:destroyclaim {id:'{{payload.attributedTo[0].object.id}}'})-[r:isDestroySubjectOf]->(:destroyclaim) RETURN (count(r)=0) as ruleMet",
          },
        },
        {
          cypher: {
            query:
              "MATCH (n:destroyclaim {id:'{{payload.attributedTo[0].object.id}}'})-[r:refersTo]->(:resource) RETURN (count(r)=0) as ruleMet",
          },
        },
      ],
    },
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "DELETE",
        endpoint:
          "{{entity-management}}/destroyclaims/{{payload.attributedTo[0].object.id}}",
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:b7bddf3c-15fc-450a-9a37-59a732fd03cd",
    title:
      "Connect a Destroy Condition with the corresponding Destroy Claim on creation",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "entity.events",
      "payload.attributedTo[0].object.id": "destroyclaim:.*",
      "payload.type": "create",
      "payload.object.id": "destroyclaim:.*",
    },
    condition: {
      and: [
        {
          mongo: {
            query: {
              id: "{{payload.object.id}}",
              destroyclaimType: "destroyCondition",
            },
          },
        },
      ],
    },
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "POST",
        endpoint: "{{entity-management}}/edges",
        body: {
          from: "{{payload.object.id}}",
          to: "{{payload.attributedTo[0].object.id}}",
          edgeType: "isDestroyConditionOf",
        },
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
  {
    id: "rule:uuid:60966238-2afe-4e95-b291-594254df692f",
    title: "Remove a Destroy Condition when related Destroy Claim was deleted",
    isActive: true,
    isEditable: true,
    scope: {
      channel: "datanetwork.events",
      "payload.type": "delete",
      "payload.object.id": "edge:.*",
      "payload.attributedTo[0].object.id": "destroyclaim:.*", // destroyCondition (from)
      "payload.attributedTo[1].object.id": "destroyclaim:.*", // destroyClaim (to)
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (n:destroyclaim {id:'{{payload.attributedTo[0].object.id}}'})-[r:isDestroyConditionOf]->(:destroyclaim) RETURN (count(r)=0) as ruleMet",
          },
        },
      ],
    },
    actions: [
      {
        headers: {
          "x-diva": { actorId: "{{payload.actor.id}}" },
        },
        method: "DELETE",
        endpoint:
          "{{entity-management}}/destroyclaims/{{payload.attributedTo[0].object.id}}",
        ignoreErrors: [
          {
            statusCode: 409, // edge already exists
          },
          {
            statusCode: 404, // one of the nodes does not exist
          },
          {
            statusCode: 403, // forbidden is forbidden, try not to write rules that confront with the policies
          },
        ],
      },
    ],
  },
];
