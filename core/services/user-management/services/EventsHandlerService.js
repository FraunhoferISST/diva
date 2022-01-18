const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const messageProducer = require("@diva/common/messaging/MessageProducer");
const usersService = require("./UsersService");

const {
  usersMongoDbConnector,
  usersCollectionName,
} = require("../utils/mongoDbConnectors");
const { name: serviceName } = require("../package.json");

const KAFKA_CONSUMER_TOPICS = process.env.KAFKA_CONSUMER_TOPICS
  ? JSON.parse(process.env.KAFKA_CONSUMER_TOPICS)
  : ["datanetwork.events", "asset.events"];

class EventsHandlerService {
  async init() {
    await usersMongoDbConnector.connect();
    this.collection = usersMongoDbConnector.collections[usersCollectionName];
    await messageConsumer.init(
      KAFKA_CONSUMER_TOPICS.map((topic) => ({ topic, spec: "asyncapi" })),
      `${serviceName}-consumer`
    );
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    try {
      const parsedMassage = JSON.parse(message.value.toString());
      const { messageName } = parsedMassage;
      if (messageName === "assetEvents") {
        await this.handleAssetEvent(parsedMassage);
      }
      if (messageName === "datanetworkEvents") {
        await this.handleAssetEvent(parsedMassage);
      }
      console.info(`💬 Processed message type "${messageName}"`);
    } catch (err) {
      console.error(err);
    }
  }

  async handleAssetEvent(parsedMassage) {
    const {
      type,
      object: { id: assetId },
      actor: { id: actorId },
    } = parsedMassage.payload;
    if (type === "delete") {
      const affectedUsers = await this.collection.find({
        isPartOfAssets: assetId,
      });
      if (affectedUsers) {
        for (const user in affectedUsers) {
          await usersService.patchById(
            user.id,
            {
              isPartOfAssets: user.isPartOfAssets.filter(
                (id) => id !== assetId
              ),
            },
            actorId
          );
          messageProducer.produce(user.id, actorId, "update");
        }
      }
    }
  }

  async handleDatanetworkEvent(parsedMassage) {
    const { type, relationType, from, to, actorId } = parsedMassage.payload;
    if (
      from.startsWith("user:") &&
      ["update", "delete"].includes(type) &&
      relationType === "isPartOf" &&
      to.startsWith("asset:")
    ) {
      const user = await usersService.getById(from).catch((e) => {
        if (e?.code === 404) {
          return null;
        }
        throw e;
      });
      if (user) {
        if (type === "delete") {
          await usersService.patchById(
            from,
            {
              isPartOfAssets: user.isPartOfAssets
                ? user.isPartOfAssets.filter((id) => id !== to)
                : [],
            },
            actorId
          );
          messageProducer.produce(from, actorId, "update");
        } else if (!(user?.isPartOfAssets ?? []).includes(to)) {
          await usersService.patchById(
            from,
            {
              isPartOfAssets: user.isPartOfAssets
                ? [...user.isPartOfAssets, to]
                : [to],
            },
            actorId
          );
          messageProducer.produce(from, actorId, "update");
        }
      }
    }
  }
}

module.exports = new EventsHandlerService();
