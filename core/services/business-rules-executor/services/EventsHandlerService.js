const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const axios = require("axios");
const urljoin = require("url-join");
const { logger: log } = require("@diva/common/logger");
const retry = require("@diva/common/utils/retrier");
const { name: serviceName } = require("../package.json");

const BUSINESS_DECISION_POINT =
  process.env.BUSINESS_DECISION_POINT || "http://localhost:3001/";

const requestActions = async (message) => {
  const { data } = await axios.post(
    urljoin(BUSINESS_DECISION_POINT, "actions"),
    message
  );
  return data;
};

const executeAction = ({
  endpoint,
  method,
  body = {},
  headers = {},
  ignoreErrors = [],
}) =>
  axios[method.toLowerCase()](endpoint, body, { headers }).catch((e) => {
    for (const error of ignoreErrors) {
      if (e?.response?.status === error.statusCode) {
        return true;
      }
    }
    throw e;
  });

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
      log.info("Executing rules actions", { action, message });
      await retry(() => executeAction(action)).catch((e) => {
        log.error("Would not able to process action", {
          action,
          error: e.toString(),
        });
      });
    }
  }
}

module.exports = new EventsHandlerService();
