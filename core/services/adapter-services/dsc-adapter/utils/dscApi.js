const axios = require("axios");
const https = require("https");
const urljoin = require("url-join");

const DSC_URL = process.env.DSC_URL || "https://localhost:7070";
const DSC_USERNAME = process.env.DSC_USERNAME || "admin";
const DSC_PASSWORD = process.env.DSC_PASSWORD || "password";
const DSC_API_BASE_URL = urljoin(DSC_URL, "/api");
const authToken = Buffer.from(
  `${DSC_USERNAME}:${DSC_PASSWORD}`,
  "utf8"
).toString("base64");

const axiosDsc = axios.create({
  baseURL: DSC_API_BASE_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    Authorization: `Basic ${authToken}`,
  },
});
const extractIdFromUrl = (url) => url.slice(url.lastIndexOf("/") + 1);

const extractData = async (requestPromise) => {
  const response = await requestPromise;
  const id = extractIdFromUrl(response.headers.location);
  return {
    id,
    ...response.data,
  };
};

const createOffer = (offer) => extractData(axiosDsc.post(`/offers`, offer));
const getOffer = (offerId) => axiosDsc.get(`/offers/${offerId}`);
const updateOffer = (id, offer) => axiosDsc.put(`/offers/${id}`, offer);
const deleteOffer = (id) => axiosDsc.delete(`/offers/${id}`);
const addRepresentationToOffer = (id, repId) =>
  axiosDsc.post(`/offers/${id}/representations`, [repId]);
const addContractToOffer = (id, conId) =>
  axiosDsc.post(`/offers/${id}/contracts`, [conId]);

const createCatalog = (title = "DIVA") =>
  extractData(axiosDsc.post("/catalogs", { title }));
const getCatalog = (id) => axiosDsc.get(`/catalogs/${id}`);
const addOfferToCatalog = (id, offerId) =>
  axiosDsc.post(`/catalogs/${id}/offers`, [offerId]);
const catalogExists = (id) =>
  getCatalog(id)
    .then(() => true)
    .catch((e) => {
      if (e?.response?.status === 404) return false;
      throw e;
    });

const createRepresentation = (rep) =>
  extractData(axiosDsc.post(`/representations`, rep));
const updateRepresentation = (id, rep) =>
  axiosDsc.put(`/representations/${id}`, rep);
const deleteRepresentation = (id) => axiosDsc.delete(`/representations/${id}`);
const addArtifactToRepresentation = (id, artifactId) =>
  axiosDsc.post(`/representations/${id}/artifacts`, [artifactId]);

const createRule = (rule) => extractData(axiosDsc.post(`/rules`, rule));
const updateRule = (id, rule) => axiosDsc.put(`/rules/${id}`, rule);
const deleteRule = (id) => axiosDsc.delete(`/rules/${id}`);

const createArtifact = (artifact) =>
  extractData(axiosDsc.post(`/artifacts`, artifact));
const updateArtifact = (id, artifact) =>
  axiosDsc.put(`/artifacts/${id}`, artifact);
const deleteArtifact = (id) => axiosDsc.delete(`/artifacts/${id}`);

const createContract = (contract) =>
  extractData(axiosDsc.post(`/contracts`, contract));
const deleteContract = (id) => axiosDsc.delete(`/contracts/${id}`);
const addRuleToContract = (id, ruleId) =>
  axiosDsc.post(`/contracts/${id}/rules`, [ruleId]);

const isOffered = (id) =>
  axiosDsc(`/offers/${id}`)
    .then(({ data }) => !!data)
    .catch((e) => {
      if (e?.response?.status === 404) {
        return false;
      }
      throw e;
    });

const createOfferFromResource = async (
  { resource, policy, representation, artifact },
  catalogId
) => {
  const { id: offerId } = await createOffer(resource);
  const { id: representationId } = await createRepresentation(representation);
  const { id: ruleId } = await createRule(policy);
  const { id: artifactId } = await createArtifact(artifact);
  const { id: contractId } = await createContract({
    title: `Contract - ${resource.title}`,
  });

  await addOfferToCatalog(catalogId, offerId);
  await addContractToOffer(offerId, contractId);
  await addRepresentationToOffer(offerId, representationId);
  await addArtifactToRepresentation(representationId, artifactId);
  await addRuleToContract(contractId, ruleId);
  return { offerId, representationId, ruleId, artifactId, contractId };
};

const updateOfferResourceAndRule = async (offer, { resource, policy }) => {
  await updateOffer(offer.offerId, resource);
  return updateRule(offer.ruleId, policy);
};

const updateOfferEntities = async (
  offer,
  { resource, representation, policy, artifact }
) => {
  await updateOffer(offer.offerId, resource);
  await updateRepresentation(offer.representationId, representation);
  await updateRule(offer.ruleId, policy);
  await updateArtifact(offer.artifactId, policy, artifact);
};

const deleteOfferResource = async (offer) => {
  await deleteOffer(offer.offerId);
  await deleteRepresentation(offer.representationId);
  await deleteRule(offer.ruleId);
  await deleteArtifact(offer.artifactId);
  await deleteContract(offer.contractId);
};

module.exports = {
  getOffer,
  createOfferFromResource,
  updateOfferResourceAndRule,
  deleteOfferResource,
  isOffered,
  catalogExists,
  createCatalog,
  createContract,
  updateOfferEntities,
};
