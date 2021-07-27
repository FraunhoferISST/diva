const ElasticsearchConnector = require("@diva/common/databases/ElasticsearchConnector");

const esConnector = new ElasticsearchConnector();

class AnalyticsService {
  async init() {
    esConnector.connect();
  }

  async countDocumentsByIndex(indexSelection = "*") {
    try {
      const { count } = await esConnector.client.count({
        index: indexSelection,
        body: { query: { match_all: {} } },
      });

      return count.toString();
    } catch (e) {
      if (e.body.error.type === "index_not_found_exception") {
        return "0";
      }
      throw new Error(e.message);
    }
  }

  async entityDistribution() {
    try {
      const res = await esConnector.client.search({
        index: "*,-.*",
        size: 0,
        body: {
          query: { match_all: {} },
          aggs: {
            entityDistribution: {
              terms: { field: "entityType.keyword" },
            },
          },
        },
      });

      const total = res.body.hits.total.value;
      const distribution = [];
      res.body.aggregations?.entityDistribution.buckets.forEach((b) => {
        distribution.push({
          entityType: b.key,
          count: b.doc_count,
          percentage: b.doc_count / total,
        });
      });
      return distribution;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async resourceTypeDistribution() {
    try {
      const res = await esConnector.client.search({
        index: "resources",
        size: 0,
        body: {
          query: { match_all: {} },
          aggs: {
            resourceTypeDistribution: {
              terms: { field: "resourceType.keyword" },
            },
          },
        },
      });

      const total = res.body.hits.total.value;
      const distribution = [];
      res.body.aggregations?.resourceTypeDistribution.buckets.forEach((b) => {
        distribution.push({
          resourceType: b.key,
          count: b.doc_count,
          percentage: b.doc_count / total,
        });
      });
      return distribution;
    } catch (e) {
      if (e?.meta.body.status === 404) {
        // index_not_found_exception
        return [];
      }
      throw new Error(e.message);
    }
  }

  async resourceMimeTypeDistribution() {
    try {
      const res = await esConnector.client.search({
        index: "resources",
        size: 0,
        body: {
          query: {
            term: {
              resourceType: {
                value: "file",
                boost: 1.0,
              },
            },
          },
          aggs: {
            mimeTypeDistribution: {
              terms: { field: "mimeType.keyword" },
            },
          },
        },
      });

      const total = res.body.hits.total.value;
      const distribution = [];
      res.body.aggregations?.mimeTypeDistribution.buckets.forEach((b) => {
        distribution.push({
          mimeType: b.key,
          count: b.doc_count,
          percentage: b.doc_count / total,
        });
      });
      return distribution;
    } catch (e) {
      if (e?.meta.body.status === 404) {
        // index_not_found_exception
        return [];
      }
      throw new Error(e.message);
    }
  }

  async resourceGetAvgRating(resourceId) {
    let res = "";
    try {
      res = await esConnector.client.search({
        index: "reviews",
        size: 0,
        body: {
          query: {
            term: {
              "belongsTo.keyword": {
                value: resourceId,
                boost: 1.0,
              },
            },
          },
          aggs: {
            avgRating: {
              avg: { field: "rating" },
            },
          },
        },
      });
    } catch (e) {
      throw new Error(e);
    }

    return res.body.aggregations?.avgRating.value;
  }
}

module.exports = new AnalyticsService();
