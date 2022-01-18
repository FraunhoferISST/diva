const getDbByEntityType = (entityType) => ({
  dbName: `${entityType}sDb`,
  collection: `${entityType}s`,
});

module.exports = {
  getDbByEntityType,
};
