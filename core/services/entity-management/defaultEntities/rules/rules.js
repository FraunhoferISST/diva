module.exports = [
  {
    id: "rule:uuid:2952b934-39c8-4d18-a09b-b9a1a73ff908",
    title: "Connect creator with the created node",
    isActive: true,
    isEditable: true,
    priority: 1,
    scope: {
      channel: "datanetwork.events",
      "payload.type": "create",
      "payload.object.id": "(resource|asset|review|service|user):.*",
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-actorid": "{{payload.actor.id}}",
        },
        method: "POST",
        endpoint: "{{datanetwork-assistant}}/edges",
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
        ], // in some cases it makes sense to ignore error, for example if the node/edge already exists
      },
    ],
  },
  {
    id: "rule:uuid:c5a20500-8d61-4ae5-acc5-d66ff73e882f",
    title: "Connect a review with the corresponding entity on review creation",
    isActive: true,
    isEditable: true,
    priority: 1,
    scope: {
      channel: "datanetwork.events",
      "payload.attributedTo[0].object.id": "(resource|asset|service):.*",
      "payload.type": "create",
      "payload.object.id": "review:.*",
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-actorid": "{{payload.actor.id}}",
        },
        method: "POST",
        endpoint: "{{datanetwork-assistant}}/edges",
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
        ],
      },
    ],
  },
  {
    id: "rule:uuid:8622b14e-6ad4-4083-8748-2d0ea462a7ee",
    title: "Delete review if corresponding entity was deleted",
    isActive: true,
    isEditable: true,
    priority: 0,
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
          "x-actorid": "{{payload.actor.id}}",
        },
        method: "DELETE",
        endpoint:
          "{{entity-management}}/reviews/{{payload.attributedTo[0].object.id}}",
        ignoreErrors: [
          {
            statusCode: 404, // already deleted, ignore it
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
    priority: 0,
    scope: {
      channel: "entity.events",
      "payload.type": "update",
      "payload.object.affectedFields": '("keywords")', // arrays will be stringified. You can then use RegEx to perform checks.
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-actorid": "{{payload.actor.id}}",
        },
        method: "POST",
        endpoint: "{{profiling-assistant}}/profiling/run/keywords_similarity",
        body: {
          entityId: "{{payload.object.id}}",
        },
      },
    ],
  },
];
