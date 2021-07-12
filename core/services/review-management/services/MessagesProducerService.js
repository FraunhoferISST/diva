const { v4 } = require("uuid");
const serviceName = require("../package.json").name;
const { requestProducer } = require("../utils/broker");
const { validateMessage } = require("../utils/validation/messagesValidation");

const serviceId = `urn:uuid:${v4()}`;
const topic = process.env.KAFKA_EVENT_TOPIC || "review.events";

const creatMessage = ({ objectId, actorid, type, attributedTo }) => ({
  schemaId: "asyncapi-specification",
  serviceName,
  serviceId,
  messageId: `urn:uuid:${v4()}`,
  messageName: "reviewEvents",
  payload: {
    type,
    actor: {
      id: actorid,
    },
    object: {
      id: objectId,
    },
    attributedTo: [
      {
        object: {
          id: attributedTo,
        },
      },
    ],
  },
  creationDate: new Date().toISOString(),
  channel: topic,
});

class MessageProducerService {
  async init(producer) {
    this.producer = producer || (await requestProducer(topic));
  }

  produce(objectId, actorid, attributedTo, type = "update") {
    try {
      const msg = creatMessage({
        objectId,
        actorid,
        attributedTo,
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
