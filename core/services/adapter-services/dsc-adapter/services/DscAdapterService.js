const {
  mongoResourcesConnector,
  mongoDscConnector,
  resourceCollectionName,
  dscLegacyCollectionName,
  dscOffersCollectionName,
  dscCatalogsCollectionName,
} = require("../utils/mongoDbConnectors");

const {
  isOffered,
  catalogExists,
  createCatalog,
  updateOfferResourceAndRule,
  createOfferFromResource,
  deleteOfferResource,
  getOffer,
} = require("../utils/dscApi");
const {
  hasSupportedDistributions,
  patchResource,
  prepareDscData,
  createDscPatch,
} = require("../utils/utils");
const {
  unsupportedDistributionsError,
  alreadyOfferedError,
  notOfferedError,
} = require("../utils/errors");

const getResource = (id) =>
  mongoResourcesConnector.collections[resourceCollectionName].findOne(
    { id },
    {
      projection: {
        _id: 0,
        title: true,
        description: true,
        dsc: true,
        distributions: true,
        keywords: true,
        byteSize: true,
        mimeType: true,
      },
    }
  );

const getLegacyCatalogId = async () => {
  const { catalogId } = await mongoResourcesConnector.collections[
    dscLegacyCollectionName
  ].findOne({});
  return catalogId;
};

const getCatalogId = async () => {
  const { catalogId } = await mongoDscConnector.collections[
    dscCatalogsCollectionName
  ].findOne({});
  return catalogId;
};

const hasLegacyDscCollection = async () => {
  const collections = await mongoResourcesConnector.database
    .listCollections({
      name: dscLegacyCollectionName,
    })
    .toArray();
  return collections.length > 0;
};

const initDscCatalog = async () => {
  let catalogId = "";
  if (await hasLegacyDscCollection()) {
    catalogId = await getLegacyCatalogId();
    await mongoResourcesConnector.database.dropCollection(
      dscLegacyCollectionName
    );
  } else {
    catalogId = await getCatalogId();
  }
  if (!catalogId || !(await catalogExists(catalogId))) {
    await mongoDscConnector.collections[dscCatalogsCollectionName].deleteOne({
      catalogId,
    });
    catalogId = (await createCatalog("Diva Catalog")).id;
    await mongoDscConnector.collections[dscCatalogsCollectionName].insertOne({
      catalogId,
    });
  }
  return catalogId;
};

const persistOfferMetadata = (offerMetadata) =>
  mongoDscConnector.collections[dscOffersCollectionName].insertOne(
    offerMetadata
  );

const deleteOfferMetadata = (resourceId) =>
  mongoDscConnector.collections[dscOffersCollectionName].deleteMany({
    resourceId,
  });
class DscAdapterService {
  async init() {
    await mongoDscConnector.connect();
    await mongoResourcesConnector.connect();
    const catalogId = await initDscCatalog();
    this.dscInfo = { catalogId };
    console.info(`Using catalog "${this.dscInfo.catalogId}" `);
  }

  async createOffer(resourceId, policy, actorId) {
    const resource = await getResource(resourceId);
    const offerId = resource?.dsc?.offer?.offerId;
    if (offerId && (await isOffered(offerId))) {
      throw alreadyOfferedError;
    }
    if (!hasSupportedDistributions(resource.distributions)) {
      throw unsupportedDistributionsError;
    }
    const offer = await createOfferFromResource(
      prepareDscData(resource, policy),
      this.dscInfo.catalogId
    );
    await patchResource(
      resourceId,
      createDscPatch({ policy, offer }),
      actorId
    ).catch((e) => {
      deleteOfferResource(offer);
      throw e;
    });
    await persistOfferMetadata({
      resourceId,
      ...offer,
      catalogId: this.dscInfo.catalogId,
    });
    return offer;
  }

  async getOffer(offerId) {
    return getOffer(offerId);
  }

  async updateOffer(resourceId, offerId, policy, actorId) {
    const resource = await getResource(resourceId);
    if (!(await isOffered(offerId))) {
      throw notOfferedError;
    }
    if (!hasSupportedDistributions(resource.distributions)) {
      throw unsupportedDistributionsError;
    }
    return updateOfferResourceAndRule(
      resource.dsc.offer,
      prepareDscData(resource, policy)
    ).then(() =>
      patchResource(
        resourceId,
        createDscPatch({ ...resource.dsc, policy }),
        actorId
      )
    );
  }

  async deleteOffer(resourceId, offerId, actorId) {
    const resource = await getResource(resourceId);
    if (await isOffered(offerId)) {
      await deleteOfferResource(resource.dsc.offer);
      await deleteOfferMetadata(resource.id);
    }
    return patchResource(resourceId, createDscPatch(), actorId);
  }
}

module.exports = new DscAdapterService();
