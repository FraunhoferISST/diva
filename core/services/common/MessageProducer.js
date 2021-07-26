const { Kafka } = require("kafkajs");
const chalk = require("chalk");
const AsyncApiValidator = require("asyncapi-validator");
const urljoin = require("url-join");
const generateUuid = require("./generateUuid");
const { createError } = require("./Error");

const KAFKA_URL = process.env.KAFKA_URL || "broker:9092";
const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";
const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";
let asyncApiValidator = "";

const loadAsyncAPISpec = async () => {
  asyncApiValidator = await AsyncApiValidator.fromSource(
    urljoin(SCHEMA_REGISTRY_URL, "schemata", ASYNCAPI_SPECIFICATION),
    {
      msgIdentifier: "name",
    }
  );
};

const validateMessage = (msg, operation = "publish") => {
  try {
    return asyncApiValidator.validate(
      msg.messageName,
      msg,
      msg.channel,
      operation
    );
  } catch (validationError) {
    throw createError({
      type: validationError.name,
      message:
        validationError.message ||
        `Supplied message for the operation "${validationError.key}" violates "${ASYNCAPI_SPECIFICATION}" schema`,
      code: 406,
      errors: validationError.errors,
    });
  }
};

const requestProducer = async (topic, serviceName) => {
  const kafka = new Kafka({
    clientId: `${serviceName}-client`,
    brokers: [KAFKA_URL],
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
  });

  const producer = kafka.producer();

  await producer.connect();
  return async (msg, key) =>
    producer.send({
      topic,
      messages: [{ ...(key ? { key } : {}), value: JSON.stringify(msg) }],
    });
};

const creatMessage = (
  { entityId, actorid, type },
  topic,
  serviceName,
  messageName
) => ({
  schemaId: "asyncapi-specification",
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
    },
  },
  creationDate: new Date().toISOString(),
  channel: topic,
});

class MessageProducer {
  async init(topic, serviceName, messageName, producer) {
    this.topic = topic;
    this.serviceName = serviceName;
    this.messageName = messageName;
    this.producer = producer || (await requestProducer(topic));
    await loadAsyncAPISpec();
    console.log(
      chalk.blue(
        `✅ Message producer ready on topic "${topic}" for "${messageName}" messages`
      )
    );
  }

  produce(entityId, actorid, type = "update") {
    try {
      const msg = creatMessage(
        {
          entityId,
          actorid,
          type,
        },
        this.topic,
        this.serviceName,
        this.messageName
      );
      validateMessage(msg);
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
