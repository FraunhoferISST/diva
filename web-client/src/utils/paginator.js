module.exports = async function* (loadPage, query, pageSize = 50) {
  let localCursor = "";
  do {
    const {
      data: { collection, cursor },
    } = await loadPage({
      ...query,
      ...(localCursor ? { cursor: localCursor } : {}),
      pageSize,
    });
    localCursor = cursor;
    yield { cursor, collection };
  } while (localCursor);
};
