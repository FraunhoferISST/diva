const { Kafka } = require("kafkajs");
const { microserviceName } = require("./info");

const KAFKA_URL = process.env.KAFKA_URL || "broker:9092";
const KAFKA_EVENT_TOPICS = process.env.KAFKA_EVENT_TOPICS
  ? JSON.parse(process.env.KAFKA_EVENT_TOPICS)
  : ["resource.events"];

const kafka = new Kafka({
  clientId: `${microserviceName}-client`,
  brokers: [KAFKA_URL],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consume = async (handler) => {
  const consumer = kafka.consumer({
    groupId: microserviceName,
    retry: {
      initialRetryTime: 1000,
      retries: 5,
    },
  });
  await consumer.connect();
  for (const topic of KAFKA_EVENT_TOPICS) {
    await consumer.subscribe({ topic });
  }
  await consumer.run({
    eachMessage: ({ message }) => handler(message),
  });
  console.info(`✅ Connected to broker "${KAFKA_URL}"`);
};

module.exports = consume;
