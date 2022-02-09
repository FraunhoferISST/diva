const request = require("supertest");

module.exports = class Request {
  constructor(server) {
    this.server = server;
  }

  runRequest(r) {
    return new Promise((resolve, reject) => {
      r.end((err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  buildQuery(queryObject) {
    let query = "";
    let prefix = "";
    for (const prop in queryObject) {
      if (queryObject[prop]) {
        query += `${prefix}${prop}=${queryObject[prop]}`;
        prefix = "&";
      }
    }
    return query ? `?${query}` : "";
  }

  makeBaseRequest(endpoint, method = "get", queryObject = {}) {
    const URL = `${endpoint}${this.buildQuery(queryObject)}`;
    return request(this.server)
      [method](URL)
      .set("x-actorid", "user:uuid:fbc29713-dfb1-4542-b20e-0b87c7531a09");
  }

  makeBodyRequest(endpoint, body = {}, method = "post") {
    return this.makeBaseRequest(endpoint, method).send(body);
  }
};
