module.exports = [
  // Development
  /* {
    id: "policy:uuid:8e37acca-7dd7-4d93-aecd-924acf678e8d",
    title: "Allow everything for entity-management (DEV only)",
    isActive: true,
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
  },
  // Images GET Policy
  {
    id: "policy:uuid:abd0c3a0-41bc-4073-9c10-20db9ed4bce1",
    title: "Everybody can GET entity images",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/[a-zA-Z0-9]+:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/images/image:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
      method: "GET",
    },
    condition: true,
  },

  // Entities: Standard DIVA Policies
  {
    id: "policy:uuid:274cf188-98f5-40b0-8e3c-fb9ee75e43c7",
    title: "Creator of resource can perform GET",
    isActive: true,
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
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})<-[e:isCreatorOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
  },
  {
    id: "policy:uuid:cd0400c9-ed81-4f41-a6a2-ebc1f3cef834",
    title: "Allows normal users to see not private entities",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/[a-zA-Z0-9]+:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              // means actually user is logged in
              "headers.diva.actorId":
                "user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}",
            },
          },
        },
        {
          mongo: {
            query: {
              id: "{{params.id}}",
              isPrivate: { $ne: true },
            },
          },
        },
      ],
    },
  },

  // Users | Login:
  {
    id: "policy:uuid:132e0f2e-19a6-4e61-b42f-e5033322b1ec",
    title: "User can execute PUT on itself (excluding admin role)",
    description:
      "The PUT request is especially required on first user login in DIVA. On first login the user will be created with the KC id. Without this the login would not be possible!",
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
    includes: ["email", "username", "roles", "groups"],
  },
  {
    id: "policy:uuid:a229c1a9-9371-4d84-89b7-81b662250c7d",
    title: "User can execute PATCH on itself (excluding admin role)",
    description:
      "THe policy allows an user to edit own data, excepting roles and groups",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
      method: "PATCH",
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
    excludes: ["groups", "roles"],
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
  },
  {
    id: "policy:uuid:99a75ace-e761-4f9b-8eeb-137da37c7b5c",
    title: "Allow only ESC to fetch resolved schemata",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "entity-management",
      path: "/resolvedSchemata/entity/?$",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "service:uuid:0a777e67-5ed7-4f1e-82d3-2078a7643ebd",
            },
          },
        },
      ],
    },
  },
  {
    id: "policy:uuid:87df1872-e685-4ee6-8ca0-001609a40e36",
    title: "Allow internal services to request AsyncAPI specification ",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "entity-management",
      path: "/asyncapis/byName/(asyncapi|datanetwork-api|event-emitter-api)/?$",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "^service:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
            },
          },
        },
      ],
    },
  },

  // Edges
  {
    id: "policy:uuid:62d1bc96-31ca-4fbc-89a1-0cef12e20c73",
    title:
      "Logged in users and internal services can perform operations on edges",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/edges/?$",
      method: "(GET|POST)",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "^(user|service):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
            },
          },
        },
      ],
    },
  },
  {
    id: "policy:uuid:4293491e-ecc5-4f79-9ba9-baf0c9c4de11",
    title:
      "Logged in users and internal services can perform operations on edges by id",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/edges/edge:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
      method: "(GET|POST|PATCH|PUT)",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "^(user|service):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$",
            },
          },
        },
        {
          mongo: {
            query: {
              id: "{{body.to.id}}",
              isEditable: true,
            },
          },
        },
        {
          mongo: {
            query: {
              id: "{{body.from.id}}",
              isEditable: true,
            },
          },
        },
      ],
    },
  },

  /*
  {
    id: "policy:uuid:66a0b4e8-f477-4c14-b846-631c1961d692
    title: "Owner of resource can perform GET",
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
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})<-[e:isOwnerOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
  },
  {
    title: "User can GET resource if both entities are part of asset",
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
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})-[:isPartOf]->(a:asset)<-[:isPartOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(a)>0) as ruleMet",
          },
        },
      ],
    },
  },
  {
    title: "Creator of resource can perform PATCH",
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
              "MATCH (r:resource {entityId:'{{path||resource:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$}}'})<-[e:isCreatorOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(e)>0) as ruleMet",
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
