const axios = require("axios");
const urljoin = require("url-join");

const { mongoDb } = require("../utils/mongoDb");
const { getDag, buildAirflowConfig } = require("../utils/airflowHelper");
const { resourceNotFoundError } = require("../utils/errors");

const AIRFLOW_URL = process.env.AIRFLOW_URL || "http://localhost:9090";
const AIRFLOW_PATH = "api/v1/dags";
const AIRFLOW_COMMAND = "dagRuns";
const AIRFLOW_USERNAME = process.env._AIRFLOW_WWW_USER_USERNAME || "airflow";
const AIRFLOW_PASSWORD = process.env._AIRFLOW_WWW_USER_PASSWORD || "airflow";

const getResource = (id, collection) => collection.findOne({ id });

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
  async init(dbName) {
    await mongoDb.connect(dbName);
    this.collection = mongoDb.resourcesCollection;
  }

  async run(resourceId, actorId) {
    const resource = await getResource(resourceId, this.collection);
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
    const resource = await getResource(resourceId, this.collection);
    if (!resource) {
      throw resourceNotFoundError;
    }
    return getDag(resource);
  }
}

module.exports = new ProfilingService();
