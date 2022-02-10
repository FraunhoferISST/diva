const axios = require("axios");
const urljoin = require("url-join");
const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const { getDag, buildAirflowConfig } = require("../utils/airflowHelper");
const { resourceNotFoundError } = require("../utils/errors");

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

  getResourceById(id) {
    return this.collection.findOne({ id });
  }

  async run(resourceId, actorId) {
    const resource = await this.getResourceById(resourceId);
    if (!resource) {
      throw resourceNotFoundError;
    }
    const dag = getDag(resource);
    return axiosAirflow.post(
      urljoin(AIRFLOW_PATH, dag.title, AIRFLOW_COMMAND),
      buildAirflowConfig(resource, actorId)
    );
  }

  async exists(resourceId) {
    const resource = await this.getResourceById(resourceId);
    if (!resource) {
      throw resourceNotFoundError;
    }
    return getDag(resource);
  }
}

module.exports = new ProfilingService();
