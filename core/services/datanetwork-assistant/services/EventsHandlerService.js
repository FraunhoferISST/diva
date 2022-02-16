const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const datanetworkService = require("./DatanetworkService");
const { name: serviceName } = require("../package.json");
const {
  IS_REVIEW_OF_RELATION,
  IS_CREATOR_OF_RELATION,
  KAFKA_CONSUMER_TOPICS,
} = require("../utils/constants");

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
      await this.handleCreateEvent(id, entityType, actorId, parsedMassage);
    } else if (type === "update") {
      await this.handleUpdateEvent(id, entityType, actorId, parsedMassage);
    } else if (type === "delete") {
      await this.handleDeleteEvent(id, entityType, actorId, parsedMassage);
    }
  }

  async handleCreateEvent(entityId, entityType, actorId, parsedMassage = {}) {
    let newEdgeId = "";
    await datanetworkService.createNode(entityId, entityType);
    newEdgeId = await datanetworkService.createEdge({
      from: actorId,
      to: entityId,
      edgeType: IS_CREATOR_OF_RELATION,
    });
    if (entityType === "review") {
      const {
        attributedTo: [
          {
            object: { id: belongsToEntityId },
          },
        ],
      } = parsedMassage.payload;
      newEdgeId = await datanetworkService.createEdge({
        from: entityId,
        to: belongsToEntityId,
        edgeType: IS_REVIEW_OF_RELATION,
      });
    }
    messageProducer.produce(newEdgeId, actorId, "create", [entityId, actorId]);
  }

  async handleUpdateEvent(entityId, entityType, actorId, parsedMassage = {}) {
    if (!(await datanetworkService.nodeExists(entityId))) {
      return this.handleCreateEvent(
        entityId,
        entityType,
        actorId,
        parsedMassage
      );
    }
  }

  async handleDeleteEvent(entityId, entityType, actorId) {
    const { collection } = await datanetworkService.getEdges(
      { from: entityId },
      true
    );
    await datanetworkService.deleteNode(entityId);
    for (const edge of collection) {
      messageProducer.produce(edge.id, actorId, "delete", [edge.to.id], {
        edgeType: edge.edgeType,
      });
    }
  }
}

module.exports = new EventsHandlerService();
