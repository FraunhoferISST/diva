const path = require("path");
const KafkaConnector = require("./KafkaConnector");
const generateUuid = require("../utils/generateUuid");
const MessagesValidator = require("./MessagesValidator");
const { logger: log } = require("../logger");
const workDir = require("../utils/workDir");

const SERVICE_ID = require(path.join(`${workDir}`, "/package.json")).serviceId;

const ASYNCAPI_SPECIFICATION = "asyncapi";

const creatMessage = (
  { entityId, actorId, type, attributedTo, additionalObjectData },
  topic,
  serviceName,
  messageName,
  spec
) => ({
  schemaId: spec,
  serviceName,
  serviceId: SERVICE_ID,
  messageId: generateUuid("message"),
  messageName,
  payload: {
    type,
    actor: {
      id: actorId,
    },
    object: {
      id: entityId,
      ...additionalObjectData,
    },
    attributedTo: attributedTo.map((id) => ({
      object: {
        id,
      },
    })),
  },
  creationDate: new Date().toISOString(),
  channel: topic,
});

class MessageProducer {
  /**
   * @param {String} topic - name of the topic to publish to
   * @param {string} serviceName - the name the service  using the producer
   * @param {String} messageName - unique message name from the specification
   * @param {Object} [spec={name: "asyncapi"}] - AsyncAPI specification to validate the messages
   * @param {String} spec.name - the name of the specification (e.g. datanetwork-api)
   * @param {Object} [spec.specification] - the parsed AsyncApi specification as object, optional. If not provided the specification will be fetched by name
   * @param {Function} [producer=undefined] - optional custom produce. Mostly relevant only for tests
   * @returns {Promise<void>}
   */
  async init(
    topic,
    serviceName,
    messageName,
    spec = { name: ASYNCAPI_SPECIFICATION },
    producer
  ) {
    const kafkaConnector = new KafkaConnector();
    this.topic = topic;
    this.spec = spec;
    this.serviceName = serviceName;
    this.messageName = messageName;
    this.producer = producer || (await kafkaConnector.createProducer(topic));
    this.messagesValidator = new MessagesValidator();
    return this.messagesValidator.init([this.spec]);
  }

  produce(
    entityId,
    actorId,
    type = "update",
    attributedTo = [],
    additionalObjectData = {}
  ) {
    const msg = creatMessage(
      {
        entityId,
        actorId,
        type,
        attributedTo,
        additionalObjectData,
      },
      this.topic,
      this.serviceName,
      this.messageName,
      this.spec.name
    );
    this.messagesValidator.validate(this.spec.name, msg, {
      ...msg,
      operation: "publish",
    });
    return this.producer(msg)
      .then(() =>
        log.info(
          `🛫 Message for "${entityId}" produced from "${actorId}" on "${type}" event flies to "${this.topic}" topic`,
          {
            topic: this.topic,
            actorId,
            messageName: this.messageName,
            serviceName: this.serviceName,
            entityId,
          }
        )
      )
      .catch((e) => {
        log.error(
          `❌ Could not send message for "${entityId}" produced from "${actorId}" on "${type}" event "${
            this.topic
          }" topic: ${e.toString()}`,
          {
            topic: this.topic,
            actorId,
            messageName: this.messageName,
            serviceName: this.serviceName,
            entityId,
          }
        );
        throw e;
      });
  }
}

module.exports = MessageProducer;
