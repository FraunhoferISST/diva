module.exports = [
  {
    title: "Creator of resource can perform GET",
    priority: 2,
    methods: ["GET"],
    scope: ["resource-management::resources/*"],
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{entityid}}'})<-[e:isCreatorOf]-(:user {entityId:'{{actorid}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
    actions: [],
    constraints: {
      included: ["A"],
      excluded: ["Z", "Y", "W"],
    },
  },
  {
    title: "Owner of resource can perform GET",
    priority: 1,
    methods: ["GET"],
    scope: ["resource-management::resources/*"],
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{entityid}}'})<-[e:isOwnerOf]-(:user {entityId:'{{actorid}}'}) RETURN (count(e)>0) as ruleMet",
          },
        },
      ],
    },
    actions: [],
    constraints: {
      included: ["B"],
      excluded: ["Y"],
    },
  },
  {
    title: "User can GET resource if both entities are part of asset",
    priority: 2,
    methods: ["GET"],
    scope: ["resource-management::resources/*"],
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{entityid}}'})-[:isPartOf]->(a:asset)<-[:isCreatorOf]-(:user {entityId:'{{actorid}}'}) RETURN (count(a)>0) as ruleMet",
          },
        },
      ],
    },
    actions: [],
    constraints: {
      included: ["Z", "Y", "n"],
      excluded: ["A"],
    },
  },
  {
    title: "User can GET resource if both entities are part of asset",
    priority: 1,
    methods: ["GET"],
    scope: ["resource-management::resources/*"],
    condition: {
      and: [
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{entityid}}'})-[:isPartOf]->(a:asset)<-[:isPartOf]-(:user {entityId:'{{actorid}}'}) RETURN (count(a)>0) as ruleMet",
          },
        },
        {
          cypher: {
            query:
              "MATCH (r:resource {entityId:'{{entityid}}'})-[:isPartOf]->(a:asset)<-[:isPartOf]-(:user {entityId:'{{actorid}}'}) RETURN (count(a)>0) as ruleMet",
          },
        },
      ],
    },
    actions: [],
    constraints: {
      included: ["D"],
      excluded: ["W"],
    },
  },
];
