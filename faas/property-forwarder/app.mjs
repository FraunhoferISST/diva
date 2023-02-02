/* eslint-disable no-console */
import urljoin from "url-join";
import axios from "axios";
import packageJson from "./package.json" assert { type: "json" };

const { serviceId } = packageJson;

const { ENTITY_ID, PATCHED_PROPERTY } = process.env;

const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";

const forwardGdprRelevancy = async () => {
  try {
    const { data: entity } = await axios.get(
      urljoin(
        ENTITY_MANAGEMENT_URL,
        `${ENTITY_ID.substr(0, ENTITY_ID.indexOf(":"))}s`,
        ENTITY_ID
      ),
      {
        headers: {
          "x-diva": JSON.stringify({
            actorId: serviceId,
          }),
        },
      }
    );

    const { data } = await axios.get(urljoin(ENTITY_MANAGEMENT_URL, "edges"), {
      params: {
        from: ENTITY_ID,
        edgeTypes: "isPartOf",
        toNodeType: "asset",
      },
      headers: {
        "x-diva": JSON.stringify({
          actorId: serviceId,
        }),
      },
    });

    if (entity.gdprRelevancy) {
      await Promise.all(
        data.collection.map(async (edge) =>
          axios.patch(
            urljoin(
              ENTITY_MANAGEMENT_URL,
              `${edge.to.entityId.substr(0, edge.to.entityId.indexOf(":"))}s`,
              edge.to.entityId
            ),
            {
              gdprRelevancy: true,
            },
            {
              headers: {
                "x-diva": JSON.stringify({
                  actorId: serviceId,
                }),
              },
            }
          )
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const analyze = async () => {
  try {
    if (PATCHED_PROPERTY === "gdprRelevancy") {
      await forwardGdprRelevancy();
    }
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

analyze()
  .then(() => {
    console.log("success");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
