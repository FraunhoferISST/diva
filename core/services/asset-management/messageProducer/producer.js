const { v4 } = require("uuid");
const serviceName = require("../package.json").name;
const { requestProducer } = require("../utils/broker");
const { validateMessage } = require("../utils/validation/messagesValidation");

const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

const serviceId = `urn:uuid:${v4()}`;

const creatMessage = (
  { assetId, actorid, type },
  messageName = "assetEvents",
  topic = process.env.KAFKA_EVENT_TOPIC || "asset.events"
) => ({
  schemaId: ASYNCAPI_SPECIFICATION,
  serviceName,
  serviceId,
  messageId: `urn:uuid:${v4()}`,
  messageName,
  payload: {
    type,
    actor: {
      id: actorid,
    },
    object: {
      id: assetId,
    },
  },
  creationDate: new Date().toISOString(),
  channel: topic,
});

class MessageProducer {
  async init() {
    this.producer = await requestProducer(
      process.env.KAFKA_EVENT_TOPIC || "asset.events"
    );
  }

  produce(assetId, actorid, type = "update") {
    try {
      const msg = creatMessage({
        assetId,
        actorid,
        type,
      });
      validateMessage(msg);
      return this.producer(msg);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new MessageProducer();
