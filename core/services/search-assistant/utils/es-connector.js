const chalk = require("chalk");
const { Client } = require("@elastic/elasticsearch");

const esURI = process.env.ELASTICSEARCH_URL || "http://localhost:9200";

const es = {
  connect() {
    this.client = new Client({
      node: {
        url: new URL(esURI),
      },
    });
    console.info(
      chalk.blue(`✅ Connected to Elasticsearch instance "${esURI}"`)
    );
  },
};

module.exports = es;
