const axios = require("axios");
const fs = require("fs-extra");
const urljoin = require("url-join");

const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";

const getEntityPathById = (entityId) =>
  `${entityId.slice(0, entityId.indexOf(":"))}s`;

const patchData = async () => {
  const entityId = process.env.ENTITY_ID;
  const entityPath = getEntityPathById(entityId);
  const content = fs.readFileSync(process.env.INPUT_FILE).toString();
  const parsed = JSON.parse(content);

  if (process.env.NODE_ENV === "development") {
    console.log(`Content to be patched: ${content}`);
  }

  if (Object.keys(parsed).length > 0) {
    return axios.patch(
      urljoin(ENTITY_MANAGEMENT_URL, entityPath, entityId),
      parsed,
      {
        headers: { "x-actorid": process.env.ACTOR_ID },
      }
    );
  }
  return true;
};

patchData()
  .then((res) => {
    console.log(res);
    console.log("success");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
