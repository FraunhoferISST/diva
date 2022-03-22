const EntityService = require("@diva/common/api/EntityService");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const { HISTORIES_COLLECTION_NAME } = require("../utils/constants");
const { deltaToHumanReadable } = require("../utils/deltaToHumanReadable");

class HistoriesService extends EntityService {
  async init() {
    this.collection = mongoDbConnector.collections[HISTORIES_COLLECTION_NAME];
  }

  sanitizeEntity({ _id, ...rest }, { humanReadable }) {
    return {
      ...rest,
      human: humanReadable && deltaToHumanReadable(rest.delta),
    };
  }
}

module.exports = new HistoriesService();
