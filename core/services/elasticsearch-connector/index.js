const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const connector = require("./Connector");
const serviceName = require("./package.json").name;
const { getOperation } = require("./utils/utils");

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["entity.events", "datanetwork.events"];

const onMessage = async (message) => {
  try {
    const parsedMassage = JSON.parse(message.value.toString());
    const {
      type,
      object: { id },
      attributedTo,
    } = parsedMassage.payload;
    if (parsedMassage.channel === "datanetwork.events") {
      // TODO as a quick prototype, we just reindex connected entities on edge event
      const connectedEntities = attributedTo.map(
        ({ object: { id: entityId } }) => ({
          id: entityId,
        })
      );
      for (const entityData of connectedEntities) {
        await connector.index(entityData.id);
      }
    } else {
      await getOperation(type)(id);
    }
    console.info(`💬 Processed message type "${type}" for entity "${id}"`);
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  try {
    await connector.init();
    await connector.createIndex("entities");
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
      serviceName
    );
    await messageConsumer.consume(onMessage);
    console.info("✅ Elasticsearch connector is running!");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
