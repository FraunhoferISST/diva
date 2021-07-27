const KafkaConnector = require("./KafkaConnector");
const messagesValidator = require("./MessagesValidator");

const ASYNCAPI_SPECIFICATION = process.env.ASYNCAPI_SPECIFICATION || "asyncapi";

class MessageConsumer {
  async init(topics, serviceName, spec = ASYNCAPI_SPECIFICATION) {
    this.kafkaConnector = new KafkaConnector();
    this.topics = topics;
    this.spec = spec;
    this.serviceName = serviceName;
  }

  consume(onMessage) {
    return this.kafkaConnector.createConsumer(
      this.serviceName,
      this.topics,
      (message) => {
        messagesValidator.validate(this.spec, message, "subscribe");
        onMessage(message);
      }
    );
  }
}

module.exports = new MessageConsumer();
