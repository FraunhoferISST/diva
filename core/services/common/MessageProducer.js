const { Kafka } = require("kafkajs");
const { v4 } = require("uuid");
const AsyncApiValidator = require("asyncapi-validator");
const urljoin = require("url-join");

const serviceId = `urn:uuid:${v4()}`;
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
    throw new Error(
      {
        type: validationError.name,
        message: `Supplied message for the operation "${validationError.key}" violates "${ASYNCAPI_SPECIFICATION}" schema`,
        code: 406,
        errors: validationError.errors,
      }.toString()
    );
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

const creatMessage = ({ userId, actorid, type }, topic, serviceName) => ({
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

class MessageProducer {
  async init(topic, serviceName, producer) {
    this.topic = topic;
    this.serviceName = serviceName;
    this.producer = producer || (await requestProducer(topic));
    await loadAsyncAPISpec();
    console.log(`Message producer ready on topic "${topic}"`);
  }

  produce(userId, actorid, type = "update") {
    try {
      const msg = creatMessage(
        {
          userId,
          actorid,
          type,
        },
        this.topic,
        this.serviceName
      );
      validateMessage(msg);
      return this.producer(msg);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new MessageProducer();
