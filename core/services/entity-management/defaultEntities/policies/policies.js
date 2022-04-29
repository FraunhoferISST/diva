module.exports = [
  // Development
  {
    id: "policy:uuid:8e37acca-7dd7-4d93-aecd-924acf678e8d",
    title: "Allow everything for entity-management (DEV only)",
    isActive: true,
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^.+$",
      method: "(GET|PUT|POST|PATCH|DELETE)",
    },
    condition: true,
    excludes: [],
  },

  // Admin Policies
  {
    id: "policy:uuid:f70c72b9-62f6-4a01-a6ee-d0d7bcbfaf31",
    title: "Admin Power Right for Entity-Management",
    isActive: true,
    isEditable: false,
    priority: 1,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^.+$",
      method: "(GET|PUT|POST|PATCH|DELETE)",
    },
    condition: {
      and: [
        {
          mongo: {
            query: {
              id: '{{headers["x-actorid"]}}',
              roles: "admin",
            },
          },
        },
        {
          mongo: {
            query: {
              id: "{{ path||[a-zA-Z]+:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12} }}",
              isEditable: { $ne: false },
            },
          },
        },
      ],
    },
    excludes: [],
  },

  // Entities: Standard DIVA Policies
  {
    id: "policy:uuid:f70c72b9-62f6-4a01-a6ee-d0d7bcbfaf31",
    title: "Creator of resource can perform GET",
    isActive: true,
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
  /*
  {
    id: "policy:uuid:66a0b4e8-f477-4c14-b846-631c1961d692
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
      "createdAt",
      "modifiedAt",
      "creatorId",
    ],
  },
  */
];
