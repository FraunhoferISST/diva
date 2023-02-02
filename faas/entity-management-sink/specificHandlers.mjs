/* eslint-disable no-use-before-define */
import urljoin from "url-join";
import axios from "axios";

const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";

const getEntityPathById = (entityId) =>
  `${entityId.slice(0, entityId.indexOf(":"))}s`;

const mergeKeywords = async (newKeywords) => {
  const entityId = process.env.ENTITY_ID;
  const entityPath = getEntityPathById(entityId);

  const oldKeywords =
    (
      await axios.get(urljoin(ENTITY_MANAGEMENT_URL, entityPath, entityId), {
        headers: {
          "x-diva": JSON.stringify({
            actorId: process.env.ACTOR_ID,
          }),
        },
      })
    ).data.keywords || [];
  return [...new Set([...newKeywords, ...oldKeywords])];
};

const handle = async (data) => {
  const tmp = JSON.parse(JSON.stringify(data));
  if ("keywords" in tmp) {
    tmp.keywords = await mergeKeywords(data.keywords);
  }
  return tmp;
};

export default handle;
