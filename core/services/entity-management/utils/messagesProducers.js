const MessageProducer = require("@diva/common/messaging/MessageProducer");

const entitiesMessagesProducer = new MessageProducer();
const dataNetworkMessagesProducer = new MessageProducer();

module.exports = {
  entitiesMessagesProducer,
  dataNetworkMessagesProducer,
};
