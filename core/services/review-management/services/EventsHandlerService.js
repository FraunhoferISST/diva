const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");

const { reviewsMongoDbConnector } = require("../utils/mongoDbConnectors");
const { name: serviceName } = require("../package.json");

const reviewsCollectionName = process.env.MONGO_COLLECTION_NAME || "reviews";

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["resource.events", "asset.events"];

class EventsHandlerService {
  async init() {
    await reviewsMongoDbConnector.connect();
    this.collection =
      reviewsMongoDbConnector.collections[reviewsCollectionName];
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
        const reviewsToDelete = await this.collection
          .find({
            belongsTo: id,
          })
          .toArray();
        await Promise.all(
          reviewsToDelete.map((review) =>
            this.collection
              .deleteOne({ id: review.id })
              .then(() => messageProducer.produce(review.id, actorId, "delete"))
          )
        );
        console.info(`💬 Processed message type "${type}" for entity "${id}"`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new EventsHandlerService();
