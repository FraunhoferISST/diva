module.exports = [
  {
    title: "Connect creator with the created node",
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
        method: "PUT",
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
    title: "Connect a review with the corresponding entity",
    priority: 1,
    scope: {
      channel: "datanetwork.events",
      "payload.attributedTo[0].object.id": "resource:.*",
      "payload.type": "create",
      "payload.object.id": "review:.*",
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-actorid": "{{payload.actor.id}}",
        },
        method: "PUT",
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
    title: "Delete review if corresponding entity was deleted",
    priority: 0,
    scope: {
      channel: "datanetwork.events",
      "payload.type": "delete",
      "payload.object.id": "edge:.*",
      "payload.attributedTo[1].object.id": "review:.*",
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:review {id:'{{payload.attributedTo[1].object.id}}'})-[:isReviewOf]->(entity) RETURN (count(entity)=0) as ruleMet",
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
          "{{entity-management}}/reviews/{{payload.attributedTo[1].object.id}}",
        ignoreErrors: [
          {
            statusCode: 404, // already deleted, ignore it
          },
        ],
      },
    ],
  },
];
