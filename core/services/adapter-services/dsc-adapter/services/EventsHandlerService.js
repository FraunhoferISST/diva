const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const {
  mongoResourcesConnector,
  mongoDscConnector,
  dscOffersCollectionName,
  resourceCollectionName,
} = require("../utils/mongoDbConnectors");
const { name: serviceName } = require("../package.json");
const {
  isOffered,
  updateOfferEntities,
  deleteOfferResource,
} = require("../utils/dscApi");
const {
  hasSupportedDistributions,
  patchResource,
  prepareDscData,
  createDscPatch,
} = require("../utils/utils");

const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["resource.events"];

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

class EventsHandlerService {
  async init() {
    await mongoResourcesConnector.connect();
    await mongoDscConnector.connect();
    this.dscOffersCollection =
      mongoDscConnector.collections[dscOffersCollectionName];
    this.resourcesCollection =
      mongoResourcesConnector.collections[resourceCollectionName];
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({
        topic,
        spec: ASYNCAPI_SPECIFICATION,
      })),
      `${serviceName}-consumer`
    );
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    try {
      const parsedMassage = JSON.parse(message.value.toString());
      const {
        type,
        object: { id },
        actor: { id: actorId },
      } = parsedMassage.payload;
      if (type === "update") {
        await this.onUpdateEvent(id, actorId);
      }
      if (type === "delete") {
        await this.onDeleteEvent(id);
      }
      console.info(`💬 Processed message type "${type}" for entity "${id}"`);
    } catch (err) {
      console.error(err);
    }
  }

  async onUpdateEvent(resourceId, actorId) {
    const resource = await getResource(resourceId);
    const offerId = resource?.dsc?.offer?.offerId;
    if (offerId) {
      if (
        (await isOffered(offerId)) &&
        hasSupportedDistributions(resource.distributions)
      ) {
        return updateOfferEntities(
          resource.dsc.offer,
          prepareDscData(resource, resource.dsc.policy)
        );
      }
      // resources don't have required distributions or is no more offered, patch to remove dsc property
      return patchResource(resourceId, createDscPatch(), actorId);
    }
  }

  async onDeleteEvent(resourceId) {
    const offerMetadata = await this.dscOffersCollection.findOne({
      resourceId,
    });
    if (offerMetadata) {
      if (await isOffered(offerMetadata.offerId)) {
        await deleteOfferResource(offerMetadata);
      }
      await this.dscOffersCollection.deleteMany({ resourceId });
    }
  }
}

module.exports = new EventsHandlerService();
