const { Kafka } = require("kafkajs");
const generateUuid = require("../utils/generateUuid");
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
        retries: 3,
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
      groupId: serviceName,
      sessionTimeout: 15000,
      retry: {
        initialRetryTime: 1000,
        retries: 5,
      },
    });

    const runConfig = {
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
    };

    const { CRASH, STOP } = consumer.events;
    [CRASH, STOP].forEach((event) =>
      consumer.on(event, async (e) => {
        log.error("Kafka connection error!", e);
        process.exit(1);
      })
    );

    await consumer.connect();
    const promises = topics.map((topic) =>
      consumer.subscribe({ topic, fromBeginning: true })
    );
    await Promise.all(promises);
    await consumer.run(runConfig);
    log.info(
      `✅ Message consumer ready on "${this.URL}" for topics: ${JSON.stringify(
        topics
      )}`
    );
  }
}

module.exports = KafkaConnector;
