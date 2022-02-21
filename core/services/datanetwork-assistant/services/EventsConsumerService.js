const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const datanetworkService = require("./DatanetworkService");
const { name: serviceName } = require("../package.json");
const { KAFKA_CONSUMER_TOPICS } = require("../utils/constants");

class EventsConsumerService {
  async init() {
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS,
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
      attributedTo,
    } = parsedMassage.payload;

    const entityType = id.slice(0, id.indexOf(":"));
    const attributedToIds = attributedTo.map(
      ({ object: { id: attrId } }) => attrId
    );

    if (type === "create") {
      await this.handleCreateEvent(id, entityType, actorId, attributedToIds);
    } else if (type === "update") {
      await this.handleUpdateEvent(id, entityType, actorId, attributedToIds);
    } else if (type === "delete") {
      await this.handleDeleteEvent(id, entityType, actorId, attributedToIds);
    }
  }

  async handleCreateEvent(entityId, entityType, actorId, attributedToIds) {
    const newNodeId = await datanetworkService.createNode(entityId, entityType);
    messageProducer.produce(newNodeId, actorId, "create", attributedToIds);
  }

  async handleUpdateEvent(entityId, entityType, actorId, attributedToIds) {
    if (!(await datanetworkService.nodeExists(entityId))) {
      return this.handleCreateEvent(
        entityId,
        entityType,
        actorId,
        attributedToIds
      );
    }
  }

  async handleDeleteEvent(entityId, entityType, actorId, attributedToIds) {
    const { collection } = await datanetworkService.getEdges(
      { from: entityId },
      true
    );
    await datanetworkService.deleteNode(entityId);
    messageProducer.produce(entityId, actorId, "delete", attributedToIds);
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

module.exports = new EventsConsumerService();
