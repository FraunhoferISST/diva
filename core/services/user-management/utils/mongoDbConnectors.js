const MongoDBConnector = require("@diva/common/MongoDBConnector");
const { GridFSBucket } = require("mongodb");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017";

const usersDbName = process.env.MONGO_DB_NAME || "usersDb";
const usersCollectionName = process.env.MONGO_COLLECTION_NAME || "users";

const historyDbName = process.env.HISTORY_DB_NAME || "historiesDb";
const historyCollectionName =
  process.env.HISTORY_COLLECTION_NAME || "histories";

const MONGO_GFS_USER_IMAGE_BUCKET_NAME =
  process.env.MONGO_GFS_USER_IMAGE_BUCKET_NAME || "userImages";

const usersMongoDbConnector = new MongoDBConnector(mongoURI, usersDbName, [
  usersCollectionName,
]);

/* usersMongoDbConnector.gfs = new GridFSBucket(usersMongoDbConnector.database, {
  bucketName: MONGO_GFS_USER_IMAGE_BUCKET_NAME,
}); */

const historyMongoDbConnector = new MongoDBConnector(mongoURI, historyDbName, [
  historyCollectionName,
]);

module.exports = {
  usersMongoDbConnector,
  historyMongoDbConnector,
};
