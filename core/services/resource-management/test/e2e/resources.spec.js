/* eslint-disable prefer-arrow-callback */
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.test`),
});
const {
  runGetTests,
  runGetByIdTests,
  runPostTests,
  runPatchTests,
  runDeleteTests,
} = require("@diva/common/test/e2e/api.entityService.spec");
const Request = require("@diva/common/test/utils/Request");
const mockData = require("@diva/common/test/utils/mockData");
const insertMockData = require("@diva/common/test/utils/insertMockData");
const chai = require("chai");

const { MONGO_COLLECTION_NAME = "resources" } = process.env;

const serverCreationPromise = require("../../index");
const {
  resourcesMongoDbConnector,
  historyMongoDbConnector,
} = require("../../utils/mongoDbConnectors");

const { expect } = chai;

describe("Resources API", () => {
  /**
   * Global available Requests instance initialized through the "before" hook
   * @type {{Request}} - required for all tests below
   */
  this.request = {};
  /**
   * Global available set of resources (entities) inserted through the API. This users can be used to test the CRUD operations
   * on /resources collection
   * @type [{id: string, title: string, resourceType: string, uniqueFingerprint: string}]
   */
  this.testEntities = [];

  let server;

  before(async function () {
    this.timeout(20000);
    await resourcesMongoDbConnector.connect();
    await resourcesMongoDbConnector.database.dropDatabase();
    server = await serverCreationPromise;
    this.request = new Request(server);
    await historyMongoDbConnector.database.dropDatabase();
    this.dbCollection =
      resourcesMongoDbConnector.collections[MONGO_COLLECTION_NAME];
    const insertedUsers = await insertMockData(MONGO_COLLECTION_NAME, server);
    this.testEntities = insertedUsers.map((id, index) => ({
      id,
      ...mockData[MONGO_COLLECTION_NAME].data[index],
    }));
  });

  after(async () => {
    await resourcesMongoDbConnector.database.dropDatabase();
    await historyMongoDbConnector.database.dropDatabase();
    await resourcesMongoDbConnector.disconnect();
    await historyMongoDbConnector.disconnect();
    await server.close();
    // process.exit(0);
  });

  describe("Test database", function () {
    it("has mock data", function (done) {
      resourcesMongoDbConnector.collections[
        MONGO_COLLECTION_NAME
      ].countDocuments()
        .then((count) => {
          expect(count).to.equal(this.testEntities.length);
          done();
        })
        .catch(done);
    });
  });

  describe("Common CRUD operations", function () {
    describe(`# GET /${MONGO_COLLECTION_NAME}`, function () {
      runGetTests(MONGO_COLLECTION_NAME);
    });
    describe(`# GET /${MONGO_COLLECTION_NAME}/{id}`, function () {
      runGetByIdTests(MONGO_COLLECTION_NAME);
    });
    describe(`# POST /${MONGO_COLLECTION_NAME}`, function () {
      runPostTests(MONGO_COLLECTION_NAME, "uniqueFingerprint");
    });
    describe(`# PATCH /${MONGO_COLLECTION_NAME}/{id}`, function () {
      runPatchTests(MONGO_COLLECTION_NAME, "title", "uniqueFingerprint");
    });
    describe(`# DELETE /${MONGO_COLLECTION_NAME}/{id}`, function () {
      runDeleteTests(MONGO_COLLECTION_NAME);
    });
  });
});
