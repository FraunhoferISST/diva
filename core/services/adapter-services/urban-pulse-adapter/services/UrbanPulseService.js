const axios = require("axios");
const crypto = require("crypto");
const urljoin = require("url-join");
const {
  noSensorsFoundError,
  createError,
  requestCanceledError,
} = require("../util/errors");

const ENTITY_MANAGEMENT_URL = urljoin(
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000",
  "resources"
);

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

const chunkArray = (array, chunkSize = 500) => {
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

const writeResponse = (res, data) =>
  new Promise((resolve) =>
    res.write(`${JSON.stringify(data)} \n`, () => {
      resolve();
    })
  );

const createResources = async (sensorResources, actorId, { req, res }) => {
  let requestCanceled = false;
  if (req) {
    req.on("close", () => {
      requestCanceled = true;
    });
  }
  const chunks = chunkArray(sensorResources, 300);
  const results = [];
  for (const chunk of chunks) {
    if (requestCanceled) {
      throw requestCanceledError;
    }
    const { data } = await axios.post(ENTITY_MANAGEMENT_URL, chunk, {
      headers: { "x-actorid": actorId },
    });
    results.push(...data);
    if (res) {
      await writeResponse(res, {
        totalCount: sensorResources.length,
        processedCount: results.length,
      });
    }
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
  async import(importData, actorid, { req, res } = null) {
    const sensorsObjects = await createSensorsObjects(importData, actorid);
    if (res) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Transfer-Encoding": "chunked",
      });
      await writeResponse(res, {
        totalCount: sensorsObjects.length,
        processedCount: 0,
      });
    }
    return createResources(sensorsObjects, actorid, { req, res });
  }
}

module.exports = new UrbanPulseResourceService();
