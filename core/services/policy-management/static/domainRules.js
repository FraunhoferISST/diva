module.exports = [
  {
    title: "Create node on entity create event",
    priority: 1,
    scope: {
      channel: "entity.events",
      "payload.type": "create",
    },
    condition: true,
    actions: [
      {
        headers: {
          "x-actorid": "{{payload.actor.id}}",
        },
        method: "PUT",
        endpoint: "http://localhost:3012/nodes",
        body: {
          entityId: "{{payload.object.id}}",
        },
        ignoreError: {
          statusCode: 409,
        }, // in some cases it makes sense to ignore error, for example if the node already exists
      },
    ],
  },
  {
    title: "Delete review if corresponding entity and creator where deleted",
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
              "MATCH (r:review {id:'{{payload.attributedTo[1].object.id}}'})-[:isReviewOf]->(res:resource) RETURN (count(res)>0) as ruleMet",
          },
        },
        {
          cypher: {
            query:
              "MATCH (r:review {id:'{{payload.attributedTo[1].object.id}}'})<-[:isCreatorOf]-(u:user) RETURN (count(u)>0) as ruleMet",
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
          "http://localhost:3000/reviews/{{payload.attributedTo[1].object.id}}",
      },
    ],
  },
];
