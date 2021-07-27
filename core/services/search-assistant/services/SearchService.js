const esb = require("elastic-builder");
const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");

const ElasticsearchConnector = require("@diva/common/ElasticsearchConnector");

class SearchService {
  async init() {
    this.elasticsearchConnector = new ElasticsearchConnector();
    return this.elasticsearchConnector.connect();
  }

  async searchAll(queryData) {
    const { cursor, pageSize = 30, q } = queryData;
    let query = q;
    let from = 0;
    let size = parseInt(pageSize, 10);

    if (cursor) {
      try {
        const oldCursor = JSON.parse(decodeCursor(cursor));
        query = oldCursor.query;
        from = oldCursor.from;
        size = oldCursor.size;
      } catch (e) {
        throw new Error(`🛑 Invalid cursor "${cursor}" provided`);
      }
    }

    const newCursor = encodeCursor(
      JSON.stringify({
        query,
        from: from + size,
        size,
      })
    );

    const requestBody = esb
      .requestBodySearch()
      .query(esb.multiMatchQuery(["*"], query).fuzziness("AUTO"))
      .sort(esb.sort("created", "desc"))
      .highlight(
        esb.highlight().fields(["*"]).preTags("<b>", "*").postTags("</b>", "*")
      )
      .toJSON();
    // requestBody._source = ["id", "entityType", "title", "keywords"];
    requestBody.from = from;
    requestBody.size = size;

    const { body } = await this.elasticsearchConnector.client.search({
      index: "*,-*kibana*",
      body: requestBody,
    });

    const requestCountBody = esb
      .requestBodySearch()
      .query(esb.multiMatchQuery(["*"], query).fuzziness("AUTO"));

    const total = (
      await this.elasticsearchConnector.client.count({
        index: "*,-*kibana*",
        body: requestCountBody,
      })
    ).body.count;

    return {
      collection: body.hits.hits.map((doc) => ({
        doc: doc._source,
        highlight: doc.highlight,
      })),
      cursor: newCursor,
      total,
    };
  }
}

module.exports = new SearchService();
