const esb = require("elastic-builder");
const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");

const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");

class SearchService {
  async init() {
    this.elasticsearchConnector = new ElasticsearchConnector();
    return this.elasticsearchConnector.connect();
  }

  async searchAll(queryData) {
    const { cursor, pageSize = 30, q = "" } = queryData;
    let query = q;
    let from = 0;
    const size = parseInt(pageSize, 10);

    if (cursor) {
      try {
        ({ query, from } = JSON.parse(decodeCursor(cursor)));
      } catch (e) {
        throw new Error(`🛑 Invalid cursor "${cursor}" provided`);
      }
    }

    const requestBody = esb
      .requestBodySearch()
      .query(
        esb
          .queryStringQuery(`${query}*`)
          .fields(["title^4", "keywords^3", "description^2", "*^1"])
          .fuzziness("AUTO")
      )
      .sort(esb.sort("_score", "desc"))
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
      .query(
        esb
          .queryStringQuery(`${query}*`)
          .fields(["title^4", "keywords^3", "description^2", "*^1"])
          .fuzziness("AUTO")
      );

    const total = (
      await this.elasticsearchConnector.client.count({
        index: "*,-*kibana*",
        body: requestCountBody,
      })
    ).body.count;

    const result = body.hits.hits.map((doc) => ({
      doc: doc._source,
      highlight: doc.highlight,
    }));

    return {
      collection: result,
      cursor:
        total - from > pageSize
          ? encodeCursor(
              JSON.stringify({
                query,
                from: from + size,
              })
            )
          : null,
      total,
    };
  }
}

module.exports = new SearchService();
