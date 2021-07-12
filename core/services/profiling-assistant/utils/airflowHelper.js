const { dagNotFoundError } = require("./errors");

const dags = [
  {
    title: "text",
    criteria: {
      resourceTypes: ["file"],
      mimeTypes: ["application/pdf", "text/plain"],
      distributionTypes: ["divaLake"],
    },
  },
  {
    title: "image",
    criteria: {
      resourceTypes: ["file"],
      mimeTypes: ["image/jpeg", "image/png"],
      distributionTypes: ["divaLake"],
    },
  },
  {
    title: "tabledata",
    criteria: {
      resourceTypes: ["file"],
      mimeTypes: ["text/csv", "application/x-sas-data"],
      distributionTypes: ["divaLake"],
    },
  },
];

const getDag = (resource) => {
  const matchingDag = dags.filter(
    ({ criteria }) =>
      criteria.resourceTypes.includes(resource.resourceType) &&
      criteria.mimeTypes.includes(resource.mimeType) &&
      resource.distributions?.some(({ type }) =>
        criteria.distributionTypes.includes(type)
      )
  )[0];

  if (matchingDag) return matchingDag;
  throw dagNotFoundError;
};

const buildAirflowConfig = (resource, actorId) => ({
  conf: {
    resourceId: resource.id,
    actorId,
    uniqueFingerprint: resource.uniqueFingerprint,
    mimeType: resource.mimeType,
  },
});

module.exports = {
  getDag,
  buildAirflowConfig,
};
