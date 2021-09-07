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

module.exports = {
  createArtifact,
  createRepresentations,
  hasSupportedDistributions,
  supportedDistributions,
};
