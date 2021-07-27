const { Client } = require("@elastic/elasticsearch");
const chalk = require("chalk");

const esURI = process.env.ELASTICSEARCH_URL || "http://localhost:9200";

class ElasticsearchConnector {
  constructor(URI = esURI) {
    this.URI = URI;
  }

  async connect() {
    this.client = new Client({
      node: {
        url: new URL(this.URI),
      },
    });
    console.info(
      chalk.blue(`✅ Connected to Elasticsearch instance "${this.URI}"`)
    );
  }
}

module.exports = ElasticsearchConnector;
