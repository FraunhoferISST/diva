const KafkaConnector = require("./KafkaConnector");
const messagesValidator = require("./MessagesValidator");

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
    await messagesValidator.init(this.topics.map(({ spec }) => spec));
  }

  consume(onMessage) {
    return this.kafkaConnector.createConsumer(
      this.serviceName,
      this.topics.map(({ topic }) => topic),
      (message, messageTopic) => {
        const parsedMsg = JSON.parse(message.value.toString());
        const { spec } = this.topics.find(
          ({ topic }) => topic === messageTopic
        )[0];
        messagesValidator.validate(spec, parsedMsg, {
          ...parsedMsg,
          operation: "publish",
        });
        onMessage(message, messageTopic);
      }
    );
  }
}

module.exports = new MessageConsumer();
