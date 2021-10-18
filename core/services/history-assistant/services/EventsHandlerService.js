const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const { name: serviceName } = require("../package.json");

const HISTORY_DB_NAME = process.env.HISTORY_DB_NAME || "historiesDb";
const HISTORY_COLLECTION_NAME =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["resource.events", "asset.events", "user.events"];

class EventsHandlerService {
  async init() {
    const mongoDbConnector = new MongoDBConnector(HISTORY_DB_NAME, [
      HISTORY_COLLECTION_NAME,
    ]);
    await mongoDbConnector.connect();
    this.collection = mongoDbConnector.collections[HISTORY_COLLECTION_NAME];
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
      serviceName
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
      if (type === "delete") {
        this.collection.deleteMany({
          belongsTo: id,
        });
        console.info(`💬 Processed message type "${type}" for entity "${id}"`);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new EventsHandlerService();
