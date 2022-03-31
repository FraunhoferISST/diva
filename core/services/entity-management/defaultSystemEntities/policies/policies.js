module.exports = [
  {
    title: "Allow everything for entity-management (DEV only)",
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^.+$",
      method: "(GET|PUT|POST|PATCH|DELETE)",
    },
    condition: true,
    excludes: [],
  },
  {
    title: "Creator of resource can perform GET",
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/resources/resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "GET",
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})<-[e:isCreatorOf]-(:user {entityId:'{{headers[\"x-actorid\"]}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
    excludes: [],
  },
  {
    title: "Owner of resource can perform GET",
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/resources/resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "GET",
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})<-[e:isOwnerOf]-(:user {entityId:'{{headers[\"x-actorid\"]}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
    excludes: [],
  },
  {
    title: "User can GET resource if both entities are part of asset",
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/resources/resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "GET",
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})-[:isPartOf]->(a:asset)<-[:isPartOf]-(:user {entityId:'{{headers[\"x-actorid\"]}}'}) RETURN (count(a)>0) as ruleMet",
          },
        },
      ],
    },
    excludes: [],
  },
  {
    title: "Creator of resource can perform PATCH",
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/resources/resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "PATCH",
    },
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})<-[e:isCreatorOf]-(:user {entityId:'{{headers[\"x-actorid\"]}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
    excludes: [
      "entityType",
      "resourceType",
      "id",
      "created",
      "modified",
      "creatorId",
    ],
  },
];
