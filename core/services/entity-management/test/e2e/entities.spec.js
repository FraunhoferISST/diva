/* eslint-disable prefer-arrow-callback */
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.test`),
});
const Request = require("@diva/common/test/utils/Request");
const chai = require("chai");
const getInsertedData = require("../utils/getInsertedData");
const insertMockData = require("../utils/insertMockData");
const {
  runGetTests,
  runGetByIdTests,
  runPostTests,
  runPatchTests,
  runDeleteTests,
} = require("./entitiesCRUD.spec");

const { MONGO_COLLECTION_NAME = "entities" } = process.env;

const serverCreationPromise = require("../../index");
const { mongoDbConnector } = require("../../utils/mongoDbConnector");

const { expect } = chai;

describe("Entities API", () => {
  /**
   * Global available Requests instance initialized through the "before" hook
   * @type {{Request}} - required for all tests below
   */
  this.request = {};
  let expressServer;

  before(async function initServerAndDb() {
    this.timeout(20000);
    expressServer = await serverCreationPromise;
    await mongoDbConnector.database.dropDatabase();
    this.request = new Request(expressServer);
    this.dbCollection = mongoDbConnector.collections[MONGO_COLLECTION_NAME];
  });

  after(async () => {
    await mongoDbConnector.database.dropDatabase();
    await mongoDbConnector.disconnect();
    await expressServer.close();
    // process.exit(0);
  });

  const entitiesTypes = ["resource", "user", "review", "service", "asset"];

  for (const entity of entitiesTypes) {
    describe(`Testing ${entity}s API`, function () {
      before(async function initTestData() {
        /**
         * Global available set of resources (entities) inserted through the API. These users can be used to test the CRUD operations
         * on /resources collection
         * @type [{id: string, title: string, resourceType: string, uniqueFingerprint: string}]
         */
        this.testEntities = [];
        await insertMockData(entity, expressServer);
        this.testEntities = await getInsertedData(entity, this.request);
      });

      it("has mock data", function (done) {
        mongoDbConnector.collections[MONGO_COLLECTION_NAME].countDocuments({
          entityType: entity,
        })
          .then((count) => {
            expect(count).to.equal(this.testEntities.length);
            done();
          })
          .catch(done);
      });

      describe(`Common CRUD operations`, function () {
        describe(`# GET /${entity}s`, function () {
          runGetTests(entity);
        });
        describe(`# GET /${entity}s/{id}`, function () {
          runGetByIdTests(entity);
        });
        describe(`# POST /${entity}s`, function () {
          runPostTests(entity /* , ["uniqueFingerprint"] */);
        });
        describe(`# PATCH /${entity}s/{id}`, function () {
          runPatchTests(
            entity,
            "entityIcon"
            /* , ["uniqueFingerprint"] */
          );
        });
        describe(`# DELETE /${entity}s/{id}`, function () {
          runDeleteTests(entity);
        });
      });
    });
  }
});
