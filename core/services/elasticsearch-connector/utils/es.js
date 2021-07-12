const { Client } = require("@elastic/elasticsearch");

const esURL = process.env.ELASTICSEARCH_URL || "http://localhost:9200";

const es = {
  connect() {
    this.client = new Client({
      node: {
        url: new URL(esURL),
      },
    });
    console.info(`✅ Connected to Elasticsearch instance "${esURL}"`);
  },
};

module.exports = es;
