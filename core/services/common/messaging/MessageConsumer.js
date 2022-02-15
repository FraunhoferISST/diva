const KafkaConnector = require("./KafkaConnector");
const MessagesValidator = require("./MessagesValidator");

const messagesValidator = new MessagesValidator();

class MessageConsumer {
  /**
   * @param {Object[]} topics - array of objects including topic and corresponding AsyncAPI Specification
   * @param {string} topics[].topic - topic to listen on
   * @param {string} topics[].spec - corresponding AsyncAPI Specification
   * @param serviceName
   * @returns {Promise<void>}
   */
  async init(topics, serviceName) {
    this.kafkaConnector = new KafkaConnector();
    this.topics = topics;
    this.serviceName = serviceName;
    await messagesValidator.init([
      ...new Set(this.topics.map(({ spec }) => spec)),
    ]);
  }

  consume(onMessage) {
    return this.kafkaConnector.createConsumer(
      this.serviceName,
      this.topics.map(({ topic }) => topic),
      (message, messageTopic) => {
        const parsedMsg = JSON.parse(message.value.toString());
        const { spec } = this.topics.find(
          ({ topic }) => topic === messageTopic
        );
        messagesValidator.validate(spec, parsedMsg, {
          ...parsedMsg,
          operation: "publish",
        });
        return onMessage(message, messageTopic);
      }
    );
  }
}

module.exports = new MessageConsumer();
