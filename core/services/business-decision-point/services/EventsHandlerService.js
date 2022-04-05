const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { logger } = require("@diva/common/logger");
const { name: serviceName } = require("../package.json");
const policiesService = require("./PoliciesService");
const { mongoDBConnector } = require("../utils/dbConnectors");
const businessRulesService = require("./BusinessRulesService");

class EventsHandlerService {
  async init() {
    const asyncApi = (
      await mongoDBConnector.collections.systemEntities.findOne(
        {
          schemaName: "asyncapi",
          systemEntityType: "asyncapi",
        },
        {
          asyncapi: 1,
        }
      )
    ).asyncapi;
    await messageConsumer.init(
      [
        {
          topic: "entity.events",
          spec: {
            name: "asyncapi",
            specification: asyncApi,
          },
        },
      ],
      serviceName
    );
    await messageConsumer.consume(this.onMessage.bind(this));
  }

  async onMessage(message) {
    const parsedMessage = JSON.parse(message.value.toString());
    const {
      object: { id },
    } = parsedMessage.payload;
    if (
      /^policy:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        id
      )
    ) {
      logger.info("🔁 Re-caching policies");
      await policiesService.cachePolicies();
    } else if (
      /^rule:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        id
      )
    ) {
      logger.info("🔁 Re-caching rules");
      await businessRulesService.cacheRules();
    }
  }
}

module.exports = new EventsHandlerService();
