const { Kafka } = require("kafkajs");
const chalk = require("chalk");
const generateUuid = require("../generateUuid");

const KAFKA_URL = process.env.KAFKA_URL || "broker:9092";

class KafkaConnector {
  constructor(URL = KAFKA_URL) {
    this.URL = URL;
    this.kafka = new Kafka({
      clientId: generateUuid("kafka-client"),
      brokers: [this.URL],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
  }

  async createProducer(topic) {
    const producer = this.kafka.producer();

    await producer.connect();
    console.info(
      chalk.blue(
        `✅ Message producer ready on "${this.URL}" for "${topic}" topic`
      )
    );
    return async (msg, key) =>
      producer.send({
        topic,
        messages: [{ ...(key ? { key } : {}), value: JSON.stringify(msg) }],
      });
  }

  async createConsumer(serviceName, topics, onMessage) {
    const consumer = this.kafka.consumer({
      clientId: generateUuid(serviceName),
      groupId: serviceName,
      retry: {
        initialRetryTime: 1000,
        retries: 5,
      },
    });

    await consumer.connect();
    const promises = topics.map((topic) => consumer.subscribe({ topic }));
    await Promise.all(promises);

    await consumer.run({
      eachMessage: ({ topic, message }) => onMessage(message, topic),
    });
    console.info(
      chalk.blue(
        `✅ Created consumer on "${this.URL}" for topics: ${JSON.stringify(
          topics
        )}`
      )
    );
  }
}

module.exports = KafkaConnector;
