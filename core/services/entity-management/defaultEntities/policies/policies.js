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

  /*
   * Entity-Management
   */

  // Admin Policies
  {
    id: "policy:uuid:f70c72b9-62f6-4a01-a6ee-d0d7bcbfaf31",
    title: "Admin Power Right for Entity-Management",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/?$",
      method: "(GET|POST|OPTIONS)",
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
      ],
    },
  },
  {
    id: "policy:uuid:c269f6ae-d5ad-4522-952e-244d0f10ac1e",
    title: "Admin Power Right for Entity-Management",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/[a-zA-Z0-9]+:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}.*",
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
    id: "policy:uuid:cd0400c9-ed81-4f41-a6a2-ebc1f3cef834",
    title: "Allows logged in users to see not private entities",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/[a-zA-Z0-9]+:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}.*",
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
  {
    id: "policy:uuid:2eff6696-ecec-4381-96dc-720b9b700edf",
    title: "Allows normal users to GET list of entities",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/?[a-zA-Z0-9/]*",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              // means actually user is logged in
              "headers.diva.actorId":
                "(user|service):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}",
            },
          },
        },
      ],
    },
  },
  {
    id: "policy:uuid:7648d3e8-b686-453a-b32f-c4a4081ffff0",
    title:
      "Creators, internal service and owners can view, edit and delete owned entities",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/((?!.*users.*)[a-zA-Z0-9]+)/[a-zA-Z0-9]+:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}.*",
      method: "(GET|PUT|PATCH|POST|DELETE)",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              // means actually user is logged in
              "headers.diva.actorId":
                "(user|service):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}",
            },
          },
        },
      ],
      or: [
        {
          inputData: {
            query: {
              "headers.diva.actorId": "{{params.id}}",
            },
          },
        },
        {
          cypher: {
            query:
              "MATCH (e {entityId:'{{params.id}}'})<-[r:isOwnerOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(r)>0) as ruleMet",
          },
        },
        {
          cypher: {
            query:
              "MATCH (e {entityId:'{{params.id}}'})<-[r:isCreatorOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(r)>0) as ruleMet",
          },
        },
      ],
    },
  },
  {
    id: "policy:uuid:468db289-3ebf-4f93-8d64-d56117875266",
    title: "Allow anybody to create entities (excluding users)",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/((?!.*users.*)[a-zA-Z0-9]+)/?$",
      method: "POST",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "(user|service):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}",
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
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
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
    title: "User can execute PATCH on itself (excluding roles and groups)",
    description:
      "The policy allows an user to edit own data, excepting roles and groups",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
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
      path: "^/users/user:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
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

  // Edges
  {
    id: "policy:uuid:4293491e-ecc5-4f79-9ba9-baf0c9c4de11",
    title:
      "Logged in users and internal services can perform operations on edges by id",
    isActive: true,
    isEditable: true,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/edges/edge:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/?$",
      method: "(GET|POST|PATCH|PUT|DELETE|OPTIONS)",
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
          inputData: {
            query: {
              "query.edgeType": "isCreatorOf",
            },
            negation: true,
          },
        },
      ],
    },
  },

  /*
   * History-Assistant
   */

  {
    id: "policy:uuid:90a7c721-a555-44e4-bc86-0eea73783c83",
    title: "History assistant policy",
    description:
      "Allows user see the entity history if they are allowed to se the corresponding entity",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "history-assistant",
      path: "^/histories/?$",
      method: "GET",
    },
    condition: {
      and: [
        {
          inputData: {
            query: {
              "headers.diva.actorId":
                "(user|service):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}",
            },
          },
        },
      ],
      or: [
        {
          inputData: {
            query: {
              "headers.diva.actorId": "{{query.attributedTo}}",
            },
          },
        },
        {
          cypher: {
            query:
              "MATCH (e {entityId:'{{query.attributedTo}}'})<-[r:isOwnerOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(r)>0) as ruleMet",
          },
        },
        {
          cypher: {
            query:
              "MATCH (e {entityId:'{{query.attributedTo}}'})<-[r:isCreatorOf]-(:user {entityId:'{{headers.diva.actorId}}'}) RETURN (count(r)>0) as ruleMet",
          },
        },
        {
          mongo: {
            query: {
              id: "{{query.attributedTo}}",
              isPrivate: { $ne: true },
            },
          },
        },
      ],
    },
  },

  /*
   * Other services, request are not limited
   */

  {
    id: "policy:uuid:3c6a7bf2-0528-41fa-9d21-183ff36ba9fb",
    title: "Allow request to other services",
    isActive: true,
    isEditable: false,
    scope: {
      "headers.serviceName": "entity-management",
      path: "^/[a-zA-Z0-9]+/?$",
      method: "(GET|POST|OPTIONS)",
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
      ],
    },
  },
];
