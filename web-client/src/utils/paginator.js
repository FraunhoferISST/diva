module.exports = async function* (loadPage, query, pageSize = 50) {
  let localCursor = "";
  do {
    const {
      data: { collection, cursor, total },
    } = await loadPage({
      ...query,
      ...(localCursor ? { cursor: localCursor } : {}),
      pageSize,
    });
    localCursor = cursor;
    yield { cursor, collection, total };
  } while (localCursor);
};
