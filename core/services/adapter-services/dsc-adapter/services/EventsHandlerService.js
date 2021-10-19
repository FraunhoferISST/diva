const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { mongoConnector } = require("../utils/mongoDbConnector");
const { name: serviceName } = require("../package.json");
const { isOffered, updateOfferEntities } = require("../utils/dscApi");
const {
  hasSupportedDistributions,
  patchResource,
  prepareDscData,
  createDscPatch,
} = require("../utils/utils");

const dscCollectionName = process.env.MONGO_DSC_COLLECTION_NAME || "dsc";
const resourceCollectionName =
  process.env.MONGO_RESOURCE_COLLECTION_NAME || "resources";
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["resource.events"];

const getResource = (id) =>
  mongoConnector.collections[resourceCollectionName].findOne(
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
    await mongoConnector.connect();
    this.dscCollection = mongoConnector.collections[dscCollectionName];
    this.dscInfo = await this.dscCollection.findOne({});
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
      console.info(`💬 Processed message type "${type}" for entity "${id}"`);
    } catch (err) {
      console.error(err);
    }
  }

  async onUpdateEvent(resourceId, actorId) {
    const resource = await getResource(resourceId, this.collection);
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
      return patchResource(resourceId, createDscPatch(), actorId);
    }
  }
}

module.exports = new EventsHandlerService();
