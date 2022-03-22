const faker = require("faker");
const casual = require("casual");
const generateUuid = require("@diva/common/generateUuid");

const getRandomIntegerInRange = (from, to) => casual.integer(from, to);

const randomHash = () =>
  [..."143baf2d3bdd2ccf5f3dfc5e5ec150ab60e44a7d95e6605d9feb2f5c9e1ab4a0"]
    .sort((_) => Math.random() - 0.5)
    .join("");

const createRandomEntity = () => ({
  entityIcon: generateUuid("image"),
  entityBanner: generateUuid("image"),
  entityImages: Array(14)
    .fill("")
    .map(() => generateUuid("image")),
});

const createRandomReview = () => ({
  ...createRandomEntity(),
  reviewText: faker.lorem.paragraph(),
  attributedTo: generateUuid("resource"),
  rating: casual.integer(1, 5),
});

const createRandomAsset = () => ({
  ...createRandomEntity(),
  assetType: "generic",
  title: faker.lorem.sentence(),
});

const createRandomService = () => ({
  ...createRandomEntity(),
  serviceType: ["generic"][getRandomIntegerInRange(0, 0)],
  title: faker.lorem.sentence(),
});

const createRandomUser = () => ({
  ...createRandomEntity(),
  username: faker.name.findName(),
  email: faker.internet.email(),
});

const createRandomResource = (
  resourceType = "file",
  mimeType = "application/pdf"
) => ({
  ...createRandomEntity(),
  title: faker.lorem.sentence(),
  resourceType,
  mimeType,
  filename: faker.system.fileName(),
  uniqueFingerprint: randomHash(),
});

const mockData = {
  users: {
    uniquenessFields: ["email"],
    createRandom: createRandomUser,
    data: Array(10).fill("").map(createRandomUser),
  },
  resources: {
    createRandom: createRandomResource,
    uniquenessFields: ["uniqueFingerprint"],
    data: [
      ...Array(10)
        .fill("")
        .map(() => createRandomResource()),
      {
        ...createRandomEntity(),
        title: "Test resource",
        resourceType: "file",
        mimeType: "text/plain",
        uniqueFingerprint: randomHash(),
        filename: faker.system.fileName(),
      },
      {
        ...createRandomEntity(),
        title: "Test resource",
        resourceType: "generic",
      },
    ],
  },
  reviews: {
    createRandom: createRandomReview,
    data: Array(10).fill("").map(createRandomReview),
  },
  assets: {
    createRandom: createRandomAsset,
    data: Array(10).fill("").map(createRandomAsset),
  },
  services: {
    createRandom: createRandomService,
    data: Array(10).fill("").map(createRandomService),
  },
};

module.exports = mockData;
