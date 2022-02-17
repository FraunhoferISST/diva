const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { name: serviceName } = require("../package.json");

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["entity.events", "datanetwork.events"];

class EventsHandlerService {
  async init() {
    this.collection = mongoDbConnector.collections[HISTORIES_COLLECTION_NAME];
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
      serviceName
    );
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    const parsedMassage = JSON.parse(message.value.toString());
    const {
      type,
      object: { id },
    } = parsedMassage.payload;
    if (type === "delete") {
      await this.collection.deleteMany({
        attributedTo: id,
      });
    }
  }
}

module.exports = new EventsHandlerService();
