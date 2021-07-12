const chalk = require("chalk");
const { Kafka } = require("kafkajs");
const packageJson = require("../package.json");

const KAFKA_URL = process.env.KAFKA_URL || "broker:9092";
const KAFKA_TOPICS = process.env.KAFKA_TOPICS
  ? JSON.parse(process.env.KAFKA_TOPICS)
  : ["resource.events", "asset.events", "user.events"];

const kafka = new Kafka({
  clientId: `${packageJson.name}-client`,
  brokers: [KAFKA_URL],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consume = async (handler) => {
  const consumer = kafka.consumer({
    groupId: packageJson.name,
    retry: {
      initialRetryTime: 1000,
      retries: 5,
    },
  });

  await consumer.connect();
  const promises = KAFKA_TOPICS.map((topic) => consumer.subscribe({ topic }));
  await Promise.all(promises);

  await consumer.run({
    eachMessage: ({ message }) => handler(message),
  });
  console.info(
    chalk.blue(
      `✅ Connected to broker "${KAFKA_URL}" and topics: ${JSON.stringify(
        KAFKA_TOPICS
      )}`
    )
  );
};

module.exports = consume;
