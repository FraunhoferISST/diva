const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");

const { assetsMongoDbConnector } = require("../utils/mongoDbConnectors");
const assetService = require("./AssetService");
const { name: serviceName } = require("../package.json");

const assetsCollectionName = process.env.MONGO_COLLECTION_NAME || "assets";

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["resource.events", "asset.events", "user.events"];

class EventsHandlerService {
  async init() {
    await assetsMongoDbConnector.connect();
    this.collection = assetsMongoDbConnector.collections[assetsCollectionName];
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
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
      if (type === "delete") {
        const likedAssets = await this.collection
          .find({
            entities: id,
          })
          .toArray();
        if (likedAssets?.length > 0) {
          await Promise.all(
            likedAssets.map((asset) =>
              assetService
                .unlinkEntity(asset.id, id, actorId)
                .then(() =>
                  messageProducer.produce(asset.id, actorId, "update")
                )
            )
          );
        }
        console.info(`💬 Processed message type "${type}" for entity "${id}"`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new EventsHandlerService();
