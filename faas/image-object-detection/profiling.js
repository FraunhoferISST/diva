const needle = require("needle");

const IMBHost = process.env.IBM_HOST || "max-object-detector";
const IMBPort = process.env.IBM_PORT || "5000";
const endpoint = `http://${IMBHost}:${IMBPort}/model/predict`;

/**
 * @param {String} filePath: path to temporary file
 * @param {String} mimeType: mime type of the resource
 * @returns {Promise|Object}
 */
const generateObjects = async (filePath, mimeType = "image/jpeg") =>
  new Promise((resolve, reject) => {
    const data = {
      image: { file: filePath, content_type: mimeType },
      threshold: 0.7, // TODO: dynamic?
    };
    needle.post(endpoint, data, { multipart: true }, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });

const mapResult = (detectedObjects) => {
  const result = [];
  if (
    typeof detectedObjects.status !== "undefined" &&
    detectedObjects.status === "ok"
  ) {
    detectedObjects.predictions.forEach((e) => {
      result.push({
        label: e.label,
        probability: e.probability,
      });
    });
  }
  return result;
};

const processFile = async (filePath, mimeType) => {
  const detectedObjects = await generateObjects(filePath, mimeType);
  return {
    imageObjects: mapResult(detectedObjects),
    keywords: mapResult(detectedObjects).map((e) => e.label),
  };
};

module.exports = { processFile };
