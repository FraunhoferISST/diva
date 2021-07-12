const { v4 } = require("uuid");
const serviceName = require("../package.json").name;
const { requestProducer } = require("../utils/broker");
const { validateMessage } = require("../utils/validation/messagesValidation");

const serviceId = `urn:uuid:${v4()}`;
const topic = process.env.KAFKA_EVENT_TOPIC || "user.events";

const creatMessage = ({ userId, actorid, type }) => ({
  schemaId: "asyncapi-specification",
  serviceName,
  serviceId,
  messageId: `urn:uuid:${v4()}`,
  messageName: "userEvents",
  payload: {
    type,
    actor: {
      id: actorid,
    },
    object: {
      id: userId,
    },
  },
  creationDate: new Date().toISOString(),
  channel: topic,
});

class MessageProducerService {
  async init(producer) {
    this.producer = producer || (await requestProducer(topic));
  }

  produce(userId, actorid, type = "update") {
    try {
      const msg = creatMessage({
        userId,
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
