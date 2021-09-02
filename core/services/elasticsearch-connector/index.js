const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const Connector = require("./Connector");
const serviceName = require("./package.json").name;
const {
  getDbByEntityId,
  getOperation,
  createIndex,
} = require("./utils/utils");

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["resource.events", "asset.events", "user.events", "review.events"];

const onMessage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());
    const {
      type,
      object: { id },
    } = parsedMassage.payload;
    const mongoDbData = getDbByEntityId(id);
    await getOperation(type)(mongoDbData, id);
    console.info(`💬 Processed message type "${type}" for entity "${id}"`);
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  try {
    await Connector.init();

    const indeciesMappings = KAFKA_CONSUMER_TOPICS.map((t) =>
      createIndex(`${t.split(".")[0]}s`)
    );
  
    await Promise.all(indeciesMappings);
  
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
      serviceName
    );
    await messageConsumer.consume(onMessage);
  
    console.info("✅ Elasticsearch connector is running!");
  } catch (e) {
    throw new Error(e);
  }
})();
