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
const getInsertedData = require("@diva/common/test/utils/getInsertedData");
const insertMockData = require("@diva/common/test/utils/insertMockData");
const chai = require("chai");

const { MONGO_COLLECTION_NAME = "assets" } = process.env;

const serverCreationPromise = require("../../index");
const {
  assetsMongoDbConnector,
  historyMongoDbConnector,
} = require("../../utils/mongoDbConnectors");

const { expect } = chai;

describe("Assets API", () => {
  /**
   * Global available Requests instance initialized through the "before" hook
   * @type {{Request}} - required for all tests below
   */
  this.request = {};
  /**
   * Global available set of assets (entities) inserted through the API. This assets can be used to test the CRUD operations
   * on /assets collection
   * @type [{id: string, password: string, email: string, username: string}]
   */
  this.testEntities = [];

  let server;

  before(async function () {
    this.timeout(20000);
    await assetsMongoDbConnector.connect();
    await assetsMongoDbConnector.database.dropDatabase();
    server = await serverCreationPromise;
    this.request = new Request(server);
    await historyMongoDbConnector.database.dropDatabase();
    this.dbCollection =
      assetsMongoDbConnector.collections[MONGO_COLLECTION_NAME];
    await insertMockData(MONGO_COLLECTION_NAME, server);
    this.testEntities = await getInsertedData(
      MONGO_COLLECTION_NAME,
      this.request
    );
  });

  after(async () => {
    await assetsMongoDbConnector.database.dropDatabase();
    await historyMongoDbConnector.database.dropDatabase();
    await assetsMongoDbConnector.disconnect();
    await historyMongoDbConnector.disconnect();
    await server.close();
    // process.exit(0);
  });

  describe("Test database", function () {
    it("has mock data", function (done) {
      assetsMongoDbConnector.collections[MONGO_COLLECTION_NAME].countDocuments()
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
      runPostTests(MONGO_COLLECTION_NAME, ["email"]);
    });
    describe(`# PATCH /${MONGO_COLLECTION_NAME}/{id}`, function () {
      runPatchTests(MONGO_COLLECTION_NAME, "username", ["email"]);
    });
    describe(`# DELETE /${MONGO_COLLECTION_NAME}/{id}`, function () {
      runDeleteTests(MONGO_COLLECTION_NAME);
    });
  });
});
