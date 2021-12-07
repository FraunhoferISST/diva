module.exports = async function* (
  collection,
  query,
  pageSize = 1000,
  projection = {}
) {
  const documentsCount = await collection.countDocuments(query);
  let lastId = "";
  let processed = 0;
  const pages = Math.ceil(documentsCount / pageSize);
  for (let i = 1; i <= pages; i++) {
    const pageData = await collection
      .find({ ...query, ...(lastId ? { _id: { $gt: lastId } } : {}) })
      .project(projection)
      .limit(pageSize)
      .toArray();
    lastId = pageData[pageData.length - 1]._id;
    processed += pageData.length;
    yield { processed, pageData };
  }
};
