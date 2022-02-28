const esb = require("elastic-builder");
const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");

const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");

const buildESQuery = (query = "") =>
  esb
    .boolQuery()
    .must(
      esb
        .multiMatchQuery(
          ["title^4", "keywords^3", "description^2", "*^1"],
          query
        )
        .fuzziness("AUTO")
        .zeroTermsQuery("all")
    );
/* .mustNot(esb.termQuery("entityType", "user"))
    .mustNot(esb.termQuery("entityType", "review")); */

class SearchService {
  async init() {
    this.esConnector = new ElasticsearchConnector();
    return this.esConnector.connect();
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
    const esQuery = buildESQuery(query);

    const searchRequestBody = esb
      .requestBodySearch()
      .query(esQuery)
      .sort(esb.sort("_score", "desc"))
      .highlight(
        esb.highlight().fields(["*"]).preTags("<b>", "*").postTags("</b>", "*")
      )
      .toJSON();

    searchRequestBody.from = from;
    searchRequestBody.size = size;

    const { body } = await this.esConnector.client.search({
      index: "entities",
      body: searchRequestBody,
    });

    const countRequestBody = esb.requestBodySearch().query(esQuery);

    const total = (
      await this.esConnector.client.count({
        index: "entities",
        body: countRequestBody,
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
