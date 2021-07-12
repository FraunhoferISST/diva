const { Kafka } = require("kafkajs");
const microserviceName = require("../package.json").name;

const KAFKA_URL = process.env.KAFKA_URL || "broker:9092";
const KAFKA_CONSUMER_TOPICS =
  process.env.KAFKA_CONSUMER_TOPICS &&
  JSON.parse(process.env.KAFKA_CONSUMER_TOPICS);

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

  const topics = KAFKA_CONSUMER_TOPICS || [
    "resource.events",
    "asset.events",
    "user.events",
    "review.events",
  ];

  for (const topic of topics) {
    // eslint-disable-next-line no-await-in-loop
    await consumer.subscribe({ topic });
  }
  await consumer.run({
    eachMessage: ({ message }) => handler(message),
  });
  console.info(
    `✅ Connected to Kafka broker "${KAFKA_URL}" on topics: ${topics}`
  );
};

module.exports = consume;
