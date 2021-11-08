const axios = require("axios");
const buildPolicy = require("./policyBuilder/buildPolicy");
const { microserviceId } = require("./info");

const RESOURCE_MANAGEMENT_URL =
  process.env.RESOURCE_MANAGEMENT_URL || "http://localhost:3000";

const representationsTypeMap = {
  httpGetBasicAuth: "https-get-basicauth",
};
const supportedDistributions = Object.keys(representationsTypeMap);

const createRepresentations = ({ title, mimeType }) => ({
  title: `Representation - ${title}`,
  mediaType: mimeType,
});

const createArtifact = ({ title, byteSize, distributions = [] }) =>
  distributions
    .filter(({ type }) => supportedDistributions.includes(type))
    .map(({ type, ...rest }) => ({
      title: `Artifact - ${title}`,
      byteSize,
      accessUrl: rest[type].url,
      username: rest[type].username,
      password: rest[type].password,
    }))[0];

const hasSupportedDistributions = (distributions = []) =>
  distributions.some(({ type }) => supportedDistributions.includes(type));

const prepareDscData = (resource, policy) => {
  const { dsc, distributions, ...rest } = resource;
  return {
    representation: createRepresentations(resource),
    artifact: createArtifact(resource),
    policy: buildPolicy(policy),
    resource: rest,
  };
};

const patchResource = (resourceId, patch, actorid = microserviceId) =>
  axios.patch(`${RESOURCE_MANAGEMENT_URL}/resources/${resourceId}`, patch, {
    headers: {
      "x-actorid": actorid,
    },
  });

const createDscPatch = (dsc) => ({
  dsc: dsc || null,
});

module.exports = {
  createArtifact,
  createRepresentations,
  hasSupportedDistributions,
  supportedDistributions,
  prepareDscData,
  patchResource,
  createDscPatch,
};
