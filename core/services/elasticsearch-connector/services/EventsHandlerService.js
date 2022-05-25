const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { logger: log } = require("@diva/common/logger");
const { name: serviceName } = require("../package.json");
const connectorService = require("./ConnectorService");
const { getOperation } = require("../utils/utils");

const KAFKA_CONSUMER_TOPICS = [
  {
    topic: "entity.events",
    spec: {
      name: "asyncapi",
    },
  },
  {
    topic: "datanetwork.events",
    spec: {
      name: "datanetwork-api",
    },
  },
];

const systemEntitiesPrefixes = ["schema", "rule", "policy"];

class EventsHandlerService {
  async init() {
    await connectorService.init();
    await messageConsumer.init(KAFKA_CONSUMER_TOPICS, serviceName);
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
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
        await connectorService.index(entityData.id);
      }
    } else if (!systemEntitiesPrefixes.some((prefix) => id.includes(prefix))) {
      await getOperation(type)(id);
    } else if (id.includes("schema")) {
      connectorService.reindex(id, type);
    }
    log.info(`💬 Processed message type "${type}" for entity "${id}"`);
  }
}

module.exports = new EventsHandlerService();
