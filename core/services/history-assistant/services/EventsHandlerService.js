const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const { HISTORIES_COLLECTION_NAME } = require("../utils/constants");
const { name: serviceName } = require("../package.json");

const KAFKA_CONSUMER_TOPICS = [
  {
    topic: "entity.events",
    spec: {
      name: "asyncapi",
    },
  },
];

class EventsHandlerService {
  async init() {
    this.collection = mongoDbConnector.collections[HISTORIES_COLLECTION_NAME];
    await messageConsumer.init(KAFKA_CONSUMER_TOPICS, serviceName);
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    const parsedMessage = JSON.parse(message.value.toString());
    const {
      type,
      object: { id },
    } = parsedMessage.payload;
    if (type === "delete") {
      await this.collection.deleteMany({
        attributedTo: id,
      });
    }
  }
}

module.exports = new EventsHandlerService();
