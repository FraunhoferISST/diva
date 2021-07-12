const axios = require("axios");
const crypto = require("crypto");
const urljoin = require("url-join");
const { noSensorsFoundError, createError } = require("../util/errors");

const RESOURCE_MANAGEMENT_URL = urljoin(
  process.env.RESOURCE_MANAGEMENT_URL || "http://localhost:3000",
  "resources"
);

const ASSET_MANAGEMENT_URL = urljoin(
  process.env.ASSET_MANAGEMENT_URL || "http://localhost:3002",
  "assets"
);

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

const chunkArray = (array) => {
  const chunkSize = 500;
  const tempArray = [];

  if (array.length <= chunkSize) {
    return [array];
  }

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    tempArray.push(chunk);
  }

  return tempArray;
};

const generateHttpGetBasicAuthDistribution = (url, username, password) => ({
  type: "httpGetBasicAuth",
  httpGetBasicAuth: {
    url,
    username,
    password,
  },
});

const createResources = async (sensorResources, actorid) => {
  const chunks = chunkArray(sensorResources);
  const results = [];
  for (const chunk of chunks) {
    const { data } = await axios.post(RESOURCE_MANAGEMENT_URL, chunk, {
      headers: { "x-actorid": actorid },
    });
    results.push(...data);
  }
  return results;
};

const generateSensorResourceSchema = (sensor, importData, actorid) => ({
  title: sensor.sensorURL,
  urbanPulseSensorSince: importData.since,
  urbanPulseSensorUntil: importData.until,
  urbanPulseSensorId: sensor.sensorId,
  resourceType: "urbanPulseSensor",
  entityType: "resource",
  creatorId: actorid,
  uniqueFingerprint: sha256(
    `${sensor.sensorId}:${importData.since}:${importData.until}`
  ),
  distributions: [
    generateHttpGetBasicAuthDistribution(
      sensor.sensorURL,
      importData.username,
      importData.password
    ),
  ],
});

const fetchSensors = async ({ baseUrl, username, password, sensors }) => {
  const url = urljoin(baseUrl, "UrbanPulseManagement/api/sensors");
  const query = sensors ? `?sids=${sensors.join(",")}` : "";
  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const { data } = await axios(`${url}${query}`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  if (sensors && sensors?.length !== data?.sensors?.length) {
    const notFoundSensors = sensors.filter(
      (sensorId) => !data.sensors.map(({ id }) => id).includes(sensorId)
    );
    throw createError({
      ...noSensorsFoundError,
      message: `The sensors with the provided id's ${notFoundSensors.join(
        ", "
      )} not found`,
    });
  } else if (data?.sensors?.length > 0)
    return data.sensors.map((sensor) => ({
      sensorId: sensor.id,
      sensorURL: urljoin(
        baseUrl,
        `/UrbanPulseData/historic/sensordata?sid=${sensor.id}`
      ),
    }));
  throw noSensorsFoundError;
};

const createSensorsObjects = async (importData, actorid) => {
  const sensors = await fetchSensors(importData);
  return sensors.map((s) =>
    generateSensorResourceSchema(s, importData, actorid)
  );
};

class UrbanPulseResourceService {
  async import(importData, actorid, createAsset = false, assetId = null) {
    const sensorsObjects = await createSensorsObjects(importData, actorid);
    return createResources(sensorsObjects, actorid);
  }

  async createAsset(asset, actorid) {
    return axios.post(
      ASSET_MANAGEMENT_URL,
      {
        assetType: "urban-pulse",
        urbanPulseUrl: asset.baseUrl,
        distributions: [
          generateHttpGetBasicAuthDistribution(
            asset.baseUrl,
            asset.username,
            asset.password
          ),
        ],
      },
      { headers: { "x-actorid": actorid } }
    );
  }
}

module.exports = new UrbanPulseResourceService();
