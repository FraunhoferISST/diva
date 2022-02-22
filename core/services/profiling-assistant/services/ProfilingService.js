const axios = require("axios");
const urljoin = require("url-join");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const { getDag, buildAirflowConfig } = require("../utils/airflowHelper");
const { entityNotFoundError } = require("../utils/errors");

const AIRFLOW_URL = process.env.AIRFLOW_URL || "http://localhost:9090";
const AIRFLOW_PATH = "api/v1/dags";
const AIRFLOW_COMMAND = "dagRuns";
const AIRFLOW_USERNAME = process.env._AIRFLOW_WWW_USER_USERNAME || "airflow";
const AIRFLOW_PASSWORD = process.env._AIRFLOW_WWW_USER_PASSWORD || "airflow";
const dbName = "divaDb";
const collectionName = "entities";

const authToken = Buffer.from(
  `${AIRFLOW_USERNAME}:${AIRFLOW_PASSWORD}`,
  "utf8"
).toString("base64");
const axiosAirflow = axios.create({
  baseURL: AIRFLOW_URL,
  headers: {
    Authorization: `Basic ${authToken}`,
  },
});

class ProfilingService {
  async init() {
    const mongoDbConnector = new MongoDBConnector(dbName, [collectionName]);
    await mongoDbConnector.connect();
    this.collection = mongoDbConnector.collections[collectionName];
  }

  getEntityById(id) {
    return this.collection.findOne({ id });
  }

  async run(entityId, actorId) {
    const entity = await this.getEntityById(entityId);
    if (!entity) {
      throw entityNotFoundError;
    }
    const dag = getDag(entity);
    return axiosAirflow.post(
      urljoin(AIRFLOW_PATH, dag.title, AIRFLOW_COMMAND),
      buildAirflowConfig(entity, actorId)
    );
  }

  async exists(entityId) {
    const entity = await this.getEntityById(entityId);
    if (!entity) {
      throw entityNotFoundError;
    }
    return getDag(entity);
  }
}

module.exports = new ProfilingService();
