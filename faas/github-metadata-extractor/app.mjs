import urljoin from "url-join";
import axios from "axios";

const ENTITY_MANAGEMENT_URL =
  process.env.ENTITY_MANAGEMENT_URL || "http://localhost:3000";
const { ENTITY_ID, ACTOR_ID } = process.env;
const GIT_HUB_BASE_URL = "https://api.github.com/repos/";
const GIT_HUB_RAW_BASE_URL = "https://raw.githubusercontent.com/";

const analyze = async () => {
  console.log("🤖 GitHub Metadata Extractor: Running...");
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
            actorId: ACTOR_ID,
          }),
        },
      }
    );

    const projectUrl = new URL(entity.gitHubProjectUrl);
    const requestUrl = urljoin(GIT_HUB_BASE_URL, projectUrl.pathname);
    const projectData = await axios.get(requestUrl);

    const { data: readme } = await axios.get(
      urljoin(
        GIT_HUB_RAW_BASE_URL,
        projectUrl.pathname,
        projectData.data.default_branch,
        "README.md"
      )
    );

    const license = {
      url: projectData.data.license.url,
      code: projectData.data.license.key,
      name: projectData.data.license.name,
    };

    const patch = {
      title: projectData.data.full_name,
      summary: projectData.data.description,
      keywords: projectData.data.topics,
      description: readme,
      licenses: [license],
    };

    await axios.patch(
      urljoin(
        ENTITY_MANAGEMENT_URL,
        `${ENTITY_ID.substr(0, ENTITY_ID.indexOf(":"))}s`,
        ENTITY_ID
      ),
      patch,
      {
        headers: {
          "x-diva": JSON.stringify({
            actorId: ACTOR_ID,
          }),
        },
      }
    );
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

analyze()
  .then(() => {
    console.log("🤖 GitHub Metadata Extractor: Finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
