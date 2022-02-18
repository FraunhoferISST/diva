const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const datanetworkService = require("./DatanetworkService");
const { name: serviceName } = require("../package.json");
const { KAFKA_CONSUMER_TOPICS } = require("../utils/constants");

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;
const producerTopic = process.env.KAFKA_EVENT_TOPIC || "datanetwork.events";

class EventsHandlerService {
  async init() {
    await messageProducer.init(
      producerTopic,
      serviceName,
      "datanetworkEvents",
      "asyncapi",
      producer
    );
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
      `${serviceName}-consumer`
    );
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    const parsedMassage = JSON.parse(message.value.toString());
    const {
      type,
      object: { id },
      actor: { id: actorId },
    } = parsedMassage.payload;
    const entityType = id.slice(0, id.indexOf(":"));

    if (type === "create") {
      await this.handleCreateEvent(id, entityType, actorId);
    } else if (type === "update") {
      await this.handleUpdateEvent(id, entityType, actorId);
    } else if (type === "delete") {
      await this.handleDeleteEvent(id, entityType, actorId);
    }
  }

  async handleCreateEvent(entityId, entityType, actorId) {
    const newNodeId = await datanetworkService.createNode(entityId, entityType);
    messageProducer.produce(newNodeId, actorId, "create", [entityId]);
  }

  async handleUpdateEvent(entityId, entityType, actorId) {
    if (!(await datanetworkService.nodeExists(entityId))) {
      return this.handleCreateEvent(entityId, entityType, actorId);
    }
  }

  async handleDeleteEvent(entityId, entityType, actorId) {
    const { collection } = await datanetworkService.getEdges(
      { from: entityId },
      true
    );
    await datanetworkService.deleteNode(entityId);
    for (const edge of collection) {
      messageProducer.produce(
        edge.id,
        actorId,
        "delete",
        [edge.from.id, edge.to.id],
        {
          edgeType: edge.edgeType,
        }
      );
    }
  }
}

module.exports = new EventsHandlerService();
