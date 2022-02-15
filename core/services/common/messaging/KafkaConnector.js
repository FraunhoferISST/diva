const { Kafka } = require("kafkajs");
const generateUuid = require("../generateUuid");
const { logger: log } = require("../logger");
const retry = require("../utils/retrier");

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
    log.info(`✅ Message producer ready on "${this.URL}" for "${topic}" topic`);
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
    const promises = topics.map((topic) =>
      consumer.subscribe({ topic, fromBeginning: true })
    );
    await Promise.all(promises);
    await consumer.run({
      autoCommit: true,
      eachMessage: ({ topic, message, partition }) =>
        retry(() => onMessage(message, topic))
          .then(() =>
            log.info(`✅ Processed message on topic ${topic}`, {
              topic,
              partition,
              offset: message.offset,
            })
          )
          .catch((e) => {
            log.error(
              `❌ Error occurred while processing a message: ${e.toString()}`,
              {
                topic,
                partition,
                offset: message.offset,
              }
            );
            throw e;
          }),
    });
    log.info(
      `✅ Message consumer ready on "${this.URL}" for topics: ${JSON.stringify(
        topics
      )}`
    );
  }
}

module.exports = KafkaConnector;
