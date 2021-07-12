const { v4 } = require("uuid");
const chalk = require("chalk");
const serviceName = require("../package.json").name;
const { requestProducer } = require("../broker");
const { validateMessage } = require("../utils/validation/messagesValidation");

const serviceId = `urn:uuid:${v4()}`;

const messageTopic = process.env.KAFKA_EVENT_TOPIC || "resource.events";
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

const creatMessage = (
  { resourceId, actorid, type },
  messageName = "resourceEvents",
  topic = messageTopic
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
      id: resourceId,
    },
  },
  creationDate: new Date().toISOString(),
  channel: topic,
});

class MessageProducerService {
  async init() {
    this.producer = await requestProducer(messageTopic);
    console.info(
      chalk.blue(
        `✅ Kafka ready: Connection to topic "${messageTopic}" established 📨`
      )
    );
  }

  produce(resourceId, actorid, type = "update") {
    try {
      const msg = creatMessage({
        resourceId,
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

module.exports = new MessageProducerService();
