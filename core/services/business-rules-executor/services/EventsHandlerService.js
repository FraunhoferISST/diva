const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const axios = require("axios");
const urljoin = require("url-join");
const { logger: log } = require("@diva/common/logger");
const retry = require("@diva/common/utils/retrier");
const { name: serviceName } = require("../package.json");

const BUSINESS_RULES_ADMINISTRATOR_URL =
  process.env.BUSINESS_RULES_ADMINISTRATOR_URL || "http://localhost:3001/";

const requestActions = async (message) => {
  const { data } = await axios.post(
    urljoin(BUSINESS_RULES_ADMINISTRATOR_URL, "actions"),
    message
  );
  return data;
};

const executeAction = ({ endpoint, method, body = {}, headers = {} }) =>
  axios[method.toLowerCase()](endpoint, body, { headers });

class EventsHandlerService {
  async init() {
    await messageConsumer.init(
      [
        {
          topic: "entity.events",
          spec: "asyncapi",
        },
        {
          topic: "datanetwork.events",
          spec: "asyncapi",
        },
      ],
      serviceName
    );
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    const parsedMassage = JSON.parse(message.value.toString());
    const actions = await requestActions(parsedMassage);
    for (const action of actions) {
      log.info("Executing rules actions", { ...action, ...message });
      // TODO: maybe catch the error after some retries and skipp the message, otherwise an incorrect action may cause a soft lock
      await retry(() => executeAction(action));
    }
  }
}

module.exports = new EventsHandlerService();
