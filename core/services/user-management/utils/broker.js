const { Kafka } = require("kafkajs");
const serviceName = require("../package.json").name;

const KAFKA_URL = process.env.KAFKA_URL || "broker:9092";

const kafka = new Kafka({
  clientId: `${serviceName}-client`,
  brokers: [KAFKA_URL],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const requestProducer = async (produceTopic) => {
  const producer = kafka.producer();

  await producer.connect();
  return async (msg, key) =>
    producer.send({
      topic: produceTopic,
      messages: [{ ...(key ? { key } : {}), value: JSON.stringify(msg) }],
    });
};

module.exports = {
  requestProducer,
};
