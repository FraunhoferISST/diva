const EntityService = require("@diva/common/api/EntityService");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const { deltaToHumanReadable } = require("../utils/deltaToHumanReadable");

const HISTORY_DB_NAME = process.env.HISTORY_DB_NAME || "historiesDb";
const HISTORY_COLLECTION_NAME =
  process.env.HISTORY_COLLECTION_NAME || "histories";

class HistoriesService extends EntityService {
  async init() {
    const mongoDbConnector = new MongoDBConnector(HISTORY_DB_NAME, [
      HISTORY_COLLECTION_NAME,
    ]);
    await mongoDbConnector.connect();
    this.collection = mongoDbConnector.collections[HISTORY_COLLECTION_NAME];
  }

  sanitizeEntity({ _id, ...rest }, { humanReadable }) {
    return {
      ...rest,
      human: humanReadable && deltaToHumanReadable(rest.delta),
    };
  }
}

module.exports = new HistoriesService();
