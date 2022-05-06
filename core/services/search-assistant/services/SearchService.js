const esb = require("elastic-builder");
const { decodeCursor, encodeCursor } = require("@diva/common/api/cursor");

const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");

const buildESQuery = (query, rest, facetsOperator) => {
  const queries = [];

  for (const [key, value] of Object.entries(rest)) {
    const values = value.split(",");
    const level2queries = [];
    values.forEach((v) => {
      level2queries.push(esb.termQuery(key, v));
    });

    queries.push(esb.boolQuery().should(level2queries));
  }

  return esb
    .boolQuery()
    .must([
      esb
        .multiMatchQuery(
          ["title^4", "keywords^3", "description^2", "*^1"],
          query
        )
        .fuzziness("AUTO")
        .zeroTermsQuery("all"),
      esb.boolQuery()[facetsOperator](queries),
    ])
    .mustNot(esb.termQuery("entityType", "review"));
};

const buildFacetsAggregation = (facets) => {
  let facetsAggs = {};
  facets.forEach((f) => {
    facetsAggs = {
      ...facetsAggs,
      ...esb.termsAggregation(f, f).order("_count", "desc").size(20).toJSON(),
    };
  });
  return facetsAggs;
};

class SearchService {
  async init() {
    this.index = "entities";
    this.esConnector = new ElasticsearchConnector();
    return this.esConnector.connect();
  }

  async searchAll(queryData) {
    const {
      cursor,
      pageSize = 30,
      q = "",
      facets = "",
      facetsOperator = "must",
      sortBy = "relevance",
      ...rest
    } = queryData;
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
    const esQuery = buildESQuery(query, rest, facetsOperator);

    const searchRequestBody = esb
      .requestBodySearch()
      .query(esQuery)
      .sort(esb.sort(sortBy === "relevance" ? "_score" : sortBy, "desc"))
      .highlight(
        esb.highlight().fields(["*"]).preTags("<b>", "*").postTags("</b>", "*")
      )
      .toJSON();

    searchRequestBody.from = from;
    searchRequestBody.size = size;
    if (facets !== "") {
      searchRequestBody.aggregations = buildFacetsAggregation(
        facets.split(",")
      );
    }

    const { body } = await this.esConnector.client.search({
      index: this.index,
      body: searchRequestBody,
    });

    const countRequestBody = esb.requestBodySearch().query(esQuery);

    const total = (
      await this.esConnector.client.count({
        index: this.index,
        body: countRequestBody,
      })
    ).body.count;

    const result = body.hits.hits.map((doc) => ({
      doc: doc._source,
      highlight: doc.highlight,
    }));

    const facetsResult = body.aggregations;

    return {
      collection: result,
      facets: facetsResult,
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
