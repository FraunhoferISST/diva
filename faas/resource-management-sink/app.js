const axios = require("axios");
const fs = require("fs-extra");
const urljoin = require("url-join");

const RESOURCE_MANAGEMENT_URL =
  process.env.RESOURCE_MANAGEMENT_URL || "localhost:3000";

const patchData = async () => {
  const resourceId = process.env.RESOURCE_ID;
  const content = fs.readFileSync(process.env.INPUT_FILE).toString();
  const parsed = JSON.parse(content);

  if (process.env.NODE_ENV === "development") {
    console.log(`Content to be patched: ${content}`);
  }

  if (Object.keys(parsed).length > 0) {
    const res = await axios.patch(
      urljoin(RESOURCE_MANAGEMENT_URL, "resources", resourceId),
      parsed,
      {
        headers: { "x-actorid": process.env.ACTOR_ID },
      }
    );

    return res;
  }

  console.log(
    `❗ Discard empty Result: ${content} (this should not be a problem)`
  );

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
