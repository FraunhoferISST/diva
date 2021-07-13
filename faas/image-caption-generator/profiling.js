const needle = require("needle");

const IMBHost = process.env.IBM_HOST || "max-image-caption-generator";
const IMBPort = process.env.IBM_PORT || "5000";
const endpoint = `http://${IMBHost}:${IMBPort}/model/predict`;

const generateCaption = async (filePath, mimeType = "image/jpeg") =>
  new Promise((resolve, reject) => {
    const data = {
      image: { file: filePath, content_type: mimeType },
    };
    needle.post(endpoint, data, { multipart: true }, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });

const mapResult = (captions) => {
  const result = [];
  if (typeof captions.status !== "undefined" && captions.status === "ok") {
    captions.predictions.forEach((e) => {
      result.push({
        index: parseInt(e.index, 10),
        caption: e.caption,
        probability: e.probability,
      });
    });
  }
  return result;
};

const processFile = async (filePath, mimeType) => {
  const captions = await generateCaption(filePath, mimeType);
  return { imageCaptions: mapResult(captions) };
};

module.exports = { processFile };
