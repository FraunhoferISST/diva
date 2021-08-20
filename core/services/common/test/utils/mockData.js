const faker = require("faker");
const casual = require("casual");
const generateUuid = require("../../generateUuid");

const randomHash = () =>
  [..."143baf2d3bdd2ccf5f3dfc5e5ec150ab60e44a7d95e6605d9feb2f5c9e1ab4a0"]
    .sort((_) => Math.random() - 0.5)
    .join("");

const createRandomReview = () => ({
  reviewText: faker.lorem.paragraph(),
  belongsTo: generateUuid("resource"),
  rating: casual.integer(1, 5),
});

const createRandomAsset = () => ({
  assetType: "generic",
  title: faker.lorem.sentence(),
  entities: [],
});

const mockData = {
  users: {
    createRandom: () => ({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }),
    data: [
      {
        username: "1 user",
        email: "msloss0@feedburner12.com",
        password: "60207c04-b0ab-4405-862c-68b9e564d5d4",
      },
      {
        username: "2 user",
        email: "gabraham1@reuters1.com",
        password: "f0704033-d3c7-4b33-9ce5-0b3f24da1ed3",
      },
      {
        username: "3 user",
        email: "jdmiterko2@slate2.com",
        password: "67fb019f-9571-4dee-b518-1cd195fabcdf",
      },
      {
        username: "4 user",
        email: "dmowatt3@discuz3.net",
        password: "5e211d61-17e1-4a54-8f35-dbbd30794acb",
      },
      {
        username: "5 user",
        email: "zjorcke4@vinaora4.com",
        password: "eaf337d9-05e9-4df7-a665-1e614021c286",
      },
      {
        username: "6 user",
        email: "rgilhooly5@gravatar5.com",
        password: "a9f79e14-d2e6-44c2-b6f0-576f4946a910",
      },
      {
        username: "7 user",
        email: "kpeskin6@sun6.com",
        password: "f7e67c22-c3c1-420b-8795-eb5cbca32fcd",
      },
      {
        username: "8 user",
        email: "dgregan7@bizjournals5.com",
        password: "e1dc95cc-b5d5-45db-9e3b-8bf018af107f",
      },
      {
        username: "9 user",
        email: "geyton8@sfgate4.com",
        password: "57396dc6-41a9-4988-b031-a607e52e82d5",
      },
      {
        username: "10 user",
        email: "ulipman9@addthis3.com",
        password: "163b98b6-add1-417f-816d-427a78d323cc",
      },
    ],
  },
  resources: {
    createRandom: (resourceType = "file", mimeType = "application/pdf") => ({
      title: faker.lorem.sentence(),
      resourceType,
      mimeType,
      filename: faker.system.fileName(),
      uniqueFingerprint: randomHash(),
    }),
    data: [
      {
        title: "resource 2",
        resourceType: "file",
        mimeType: "application/pdf",
        uniqueFingerprint: randomHash(),
        filename: faker.system.fileName(),
      },
      {
        title: "resource 3",
        resourceType: "file",
        mimeType: "application/pdf",
        uniqueFingerprint: randomHash(),
        filename: faker.system.fileName(),
      },
      {
        title: "resource 4",
        resourceType: "file",
        mimeType: "text/plain",
        uniqueFingerprint: randomHash(),
        filename: faker.system.fileName(),
      },
      {
        title: "resource 5",
        resourceType: "file",
        mimeType: "text/plain",
        uniqueFingerprint: randomHash(),
        filename: faker.system.fileName(),
      },
      {
        title: "resource 6",
        resourceType: "file",
        mimeType: "text/plain",
        uniqueFingerprint: randomHash(),
        filename: faker.system.fileName(),
      },
      {
        title: "resource 1",
        resourceType: "generic",
      },
    ],
  },
  reviews: {
    createRandom: createRandomReview,
    data: Array(10)
      .fill("")
      .map(() => createRandomReview()),
  },
  assets: {
    createRandom: createRandomAsset,
    data: Array(10)
      .fill("")
      .map(() => createRandomAsset()),
  },
};

module.exports = mockData;
