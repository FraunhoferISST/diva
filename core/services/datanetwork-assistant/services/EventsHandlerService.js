const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const messagesProducer = require("@diva/common/messaging/MessageProducer");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const datanetworkService = require("./DatanetworkService");
const { name: serviceName } = require("../package.json");
const { getDbByEntityType } = require("../utils/utils");
const {
  IS_REVIEW_OF_RELATION,
  IS_CREATOR_OF_RELATION,
  KAFKA_CONSUMER_TOPICS,
} = require("../utils/constants");

const mongoConnector = new MongoDBConnector();

const getEntity = (dbName, collection, id) =>
  mongoConnector.client
    .db(dbName)
    .collection(collection)
    .findOne({ id }, { projection: { _id: 0 } });

const NODE_ENV = process.env.NODE_ENV || "development";
const producer = NODE_ENV === "test" ? () => Promise.resolve() : null;
const producerTopic = process.env.KAFKA_EVENT_TOPIC || "datanetwork.events";

class EventsHandlerService {
  async init() {
    await mongoConnector.connect();
    await messagesProducer.init(
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
    try {
      const parsedMassage = JSON.parse(message.value.toString());
      const {
        type,
        object: { id },
        actor: { id: actorId },
      } = parsedMassage.payload;
      const { messageName } = parsedMassage;
      if (
        [
          "assetEvents",
          "resourceEvents",
          "serviceEvents",
          "userEvents",
        ].includes(messageName)
      ) {
        const entityType = id.slice(0, id.indexOf(":"));

        if (type === "create") {
          await this.handleCreateEvent(id, entityType, actorId);
        } else if (type === "update") {
          await this.handleUpdateEvent(id, entityType, actorId);
        } else if (type === "delete") {
          await this.handleDeleteEvent(id, entityType, actorId);
        }
        console.info(`💬 Processed message type "${messageName}"`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleCreateEvent(entityId, entityType, actorId) {
    const { dbName, collection } = getDbByEntityType(entityType);
    const entity = await getEntity(dbName, collection, entityId);
    let newEdgeId = "";
    await datanetworkService.createNode(entityId, entityType);
    newEdgeId = await datanetworkService.createEdge({
      from: actorId,
      to: entityId,
      edgeType: IS_CREATOR_OF_RELATION,
    });
    if (entityType === "review") {
      newEdgeId = await datanetworkService.createEdge({
        from: entityId,
        to: entity.belongsTo,
        edgeType: IS_REVIEW_OF_RELATION,
      });
    }
    messageProducer.produce(newEdgeId, actorId, "create", [entityId, actorId]);
  }

  async handleUpdateEvent(entityId, entityType, actorId) {
    if (!(await datanetworkService.nodeExists(entityId))) {
      return this.handleCreateEvent(entityId, entityType, actorId);
    }
  }

  async handleDeleteEvent(entityId, entityType, actorId) {}
}

module.exports = new EventsHandlerService();
