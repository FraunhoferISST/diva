const chalk = require("chalk");
const KafkaConnector = require("./KafkaConnector");
const generateUuid = require("../generateUuid");
const MessagesValidator = require("./MessagesValidator");

const messagesValidator = new MessagesValidator();

const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

const creatMessage = (
  { entityId, actorid, type, attributedTo, additionalObjectData },
  topic,
  serviceName,
  messageName,
  spec
) => ({
  schemaId: spec,
  serviceName,
  serviceId: generateUuid("service"),
  messageId: generateUuid("message"),
  messageName,
  payload: {
    type,
    actor: {
      id: actorid,
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
  async init(
    topic,
    serviceName,
    messageName,
    spec = ASYNCAPI_SPECIFICATION,
    producer
  ) {
    const kafkaConnector = new KafkaConnector();
    this.topic = topic;
    this.spec = spec;
    this.serviceName = serviceName;
    this.messageName = messageName;
    this.producer = producer || (await kafkaConnector.createProducer(topic));
    return messagesValidator.init([this.spec]);
  }

  produce(
    entityId,
    actorid,
    type = "update",
    attributedTo = [],
    additionalObjectData = {}
  ) {
    try {
      const msg = creatMessage(
        {
          entityId,
          actorid,
          type,
          attributedTo,
          additionalObjectData,
        },
        this.topic,
        this.serviceName,
        this.messageName,
        this.spec
      );
      messagesValidator.validate(this.spec, msg, {
        ...msg,
        operation: "publish",
      });
      return this.producer(msg).then(() =>
        console.log(
          chalk.green(
            `🛫 Message for "${entityId}" produced from "${actorid}" on "${type}" event flies to "${this.topic}" topic`
          )
        )
      );
    } catch (e) {
      console.error(
        chalk.red(
          `❌ Could not send message for "${entityId}" produced from "${actorid}" on "${type}" event flies to "${this.topic}" topic`
        )
      );
      console.error(e);
    }
  }
}

module.exports = new MessageProducer();
