const {
  assetsMongoDbConnector,
  resourcesMongoDbConnector,
} = require("../utils/mongoDbConnectors");

const Neo4jConnector = require("@diva/common/databases/Neo4jConnector");
const neo4jConnector = new Neo4jConnector();

const policies = require("../static/rules.json");

const executeSession = (query) => {
  const session = neo4jConnector.client.session();
  return session.run(query).finally(() => session.close());
};

class PolicyDecisionService {
  async init() {
    await assetsMongoDbConnector.connect();
    await resourcesMongoDbConnector.connect();
    await neo4jConnector.connect();
    this.neo4jClient = neo4jConnector.client;

    this.collection = resourcesMongoDbConnector.collections["resources"];
  }

  async requestDecision(reqBody) {
    console.log(reqBody);

    this.actorid = reqBody["x-actorid"];
    this.entityid = reqBody["entityid"];

    let decision = false;
    const constraints = [];

    // TODO GET policies

    await Promise.all(policies.map(async (policy) => {
      const evaluation = await this.evaluateCondition(policy.condition);
      console.log("sub result:", evaluation);
      if(evaluation === true) {
        console.log("hi")
        decision = true;
        constraints.push(policy.constraints)
      }
    }));

    console.log("final result", decision)
    return {
      decision: decision,
      constraints: this.merge(constraints)
    };
  }

  async evaluateCondition(policy) {
    let decision = false;

    if(policy.hasOwnProperty("and")) {
      let subDecision = true;

      policy["and"].forEach(rule => {
        subDecision = subDecision && this.evaluateCondition(rule);
      })

      decision = subDecision;
      // console.log("and: ", decision);
    } else if (policy.hasOwnProperty("or")) {
      policy["or"].forEach(rule => {
        decision = decision || this.evaluateCondition(rule);
      })
      // console.log("or: ", decision);
    } else if (policy.hasOwnProperty("mongo")) {
      const query = this.enrichQuery(policy["mongo"]["query"], {entityid: this.entityid, actorid: this.actorid});
      const count = await this.collection.countDocuments(JSON.parse(query));
      if(count) {
        decision = true;
      }
      // console.log("mongo: ", decision);
    } else if (policy.hasOwnProperty("cypher")) {
      const query = this.enrichQuery(policy["cypher"], {entityid: this.entityid, actorid: this.actorid});
      const { records } = await executeSession(query);
      if (records.length > 0) {
        decision = records[0]._fields[0];
        // console.log("cyper: ", decision);
      }
    } else {
      //default case
    }
    
    // console.log("final decision: ", decision);
    return decision;
  }

  merge(constraints) {
    return constraints;
  }

  enrichQuery(query, valueObj) {
    // match every template that has form '[[value]]'
    const templateMatcher = /\[\[([^{}]*)\]\]/g;
    const text = query.replace(templateMatcher, (substring, value, index) => {
      value = valueObj[value];
      return value;
    });
    console.log(text);
    return text;
  }
}

module.exports = new PolicyDecisionService();