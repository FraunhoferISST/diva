module.exports = [
  // Development
  /* {
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
  }, */

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
      method: "(GET|PUT|POST|PATCH|DELETE|OPTIONS)",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.realm_access.roles": '("admin")',
            },
          },
        },
        {
          mongo: {
            query: {
              id: "{{params.id}}",
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
    id: "policy:uuid:274cf188-98f5-40b0-8e3c-fb9ee75e43c7",
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

  // Users | Login:
  {
    id: "policy:uuid:132e0f2e-19a6-4e61-b42f-e5033322b1ec",
    title: "User can execute PUT on itself (excluding admin role)",
    description:
      "The post request is especially required on first user login in DIVA. On first login the user will be created with the KC id. Without this the login would not be possible!",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "PUT",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId": "{{params.id}}",
              // normal users can not put admin role
              "body.roles": "^((?!admin).)*$",
            },
          },
        },
      ],
    },
    excludes: [],
  },
  {
    id: "policy:uuid:57fc472b-57ef-4115-84e6-33d8ea1832be",
    title: "User can delete own DIVA account",
    description: "The policy allows each user to delete it own account",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "DELETE",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId": "{{params.id}}",
            },
          },
        },
      ],
    },
  },
  {
    id: "policy:uuid:9e671c93-d1d8-469f-a8ea-96260f64b687",
    title: "User can read own data",
    description: "User should be able to read own data without restrictions",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "^user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}?",
            },
          },
        },
        {
          inputData: {
            query: {
              "headers.diva.actorId": "{{params.id}}",
            },
          },
        },
      ],
    },
    excludes: [],
  },
  {
    id: "policy:uuid:4dd56f09-2d57-4671-8527-0b0ea9a5a0f2",
    title: "Logged in clients can filter users by email",
    description:
      "Required for login to check if user already exists by given email",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/users/?$",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "^user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
              // must contain email as query
              "query.email": ".+",
              // force the request to contain at most email and id as projection
              "query.fields": "email(,id)?",
            },
          },
        },
      ],
    },
    excludes: [],
  },

  // System entities
  {
    id: "policy:uuid:c5b6881f-c0ab-49be-9a4c-a77fb23dd2ee",
    title: "Request schemata by scope",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "entity-management",
      path: "/scopedSchemata/?$",
      method: "POST",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "^user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
            },
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
