const { Client } = require("@elastic/elasticsearch");
const { logger: log } = require("../logger");

const esURI = process.env.ELASTICSEARCH_URL || "http://localhost:9200";

class ElasticsearchConnector {
  constructor(URI = esURI) {
    this.URI = URI;
  }

  connect() {
    this.client = new Client({
      node: {
        url: new URL(this.URI),
      },
    });
    log.info(`✅ Connected to Elasticsearch instance "${this.URI}"`);
  }
}

module.exports = ElasticsearchConnector;
