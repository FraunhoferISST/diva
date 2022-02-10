const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { removeObjects } = require("../utils/minio");
const {
  mongoDbConnector,
  collectionName,
} = require("../utils/mongoDbConnectors");
const { name: serviceName } = require("../package.json");

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["entity.events"];

class EventsHandlerService {
  async init() {
    this.collection = mongoDbConnector.collections[collectionName];
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
      } = parsedMassage.payload;
      if (type === "delete" && id.startsWith("resource:")) {
        const objects = await this.collection
          .find({ resourceId: id })
          .toArray();
        await removeObjects(
          objects.map(({ fileHashSha256 }) => fileHashSha256)
        );
        await this.collection.deleteMany({ resourceId: id });
        console.info(`💬 Processed message type "${type}" for entity "${id}"`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new EventsHandlerService();
