const MongoDBConnector = require("@diva/common/databases/MongoDBConnector");
const { GridFSBucket } = require("mongodb");

const usersDbName = process.env.MONGO_DB_NAME || "usersDb";
const usersCollectionName = process.env.MONGO_COLLECTION_NAME || "users";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const MONGO_GFS_USER_IMAGE_BUCKET_NAME =
  process.env.MONGO_GFS_USER_IMAGE_BUCKET_NAME || "userImages";

const usersMongoDbConnector = new MongoDBConnector(usersDbName, [
  usersCollectionName,
]);

/* usersMongoDbConnector.gfs = new GridFSBucket(usersMongoDbConnector.database, {
  bucketName: MONGO_GFS_USER_IMAGE_BUCKET_NAME,
}); */

const historyMongoDbConnector = new MongoDBConnector(historyDbName, [
  historyCollectionName,
]);

module.exports = {
  usersMongoDbConnector,
  historyMongoDbConnector,
};
