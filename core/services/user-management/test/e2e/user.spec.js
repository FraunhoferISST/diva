const chai = require("chai");
const request = require("supertest");
const chaiResponseValidator = require("chai-openapi-response-validator");

const createTestServer = require("../testApp");
const { db } = require("../../utils/mongoDbConnectors");
const mockData = require("../mockData");

chai.use(require("chai-sorted"));

chai.use(chaiResponseValidator(`${process.cwd()}/apiDoc/openapi.yml`));

const { expect } = chai;
let server;

const buildQuery = (queryObject) => {
  let query = "";
  let prefix = "";
  for (const prop in queryObject) {
    if (queryObject[prop]) {
      query += `${prefix}${prop}=${queryObject[prop]}`;
      prefix = "&";
    }
  }
  return query ? `?${query}` : "";
};

const makeBaseRequest = (endpoint, method = "get", queryObject = {}) => {
  const URL = `${endpoint}${buildQuery(queryObject)}`;
  return request(server)
    [method](URL)
    .set("x-actorid", "user:uuid:fbc29713-dfb1-4542-b20e-0b87c7531a09");
};

const makeBodyRequest = (endpoint, body = {}, method = "post") =>
  makeBaseRequest(endpoint, method).send(body);
const makeVerifyRequest = (endpoint, token) =>
  makeBaseRequest(endpoint, "post").set("Authorization", `Bearer ${token}`);

const runRequest = (r) =>
  new Promise((resolve, reject) => {
    r.end((err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });

const userCreationTests = (endpoint, user, badUser) => {
  it("satisfies OpenAPI spec", async () => {
    const res = await runRequest(makeBodyRequest(endpoint, user));
    expect(res).to.satisfyApiSpec;
    expect(res.status).to.equal(201);
  });
  it("adds new user to database", async () => {
    const createdUser = await db.usersCollection.findOne({
      email: user.email,
    });
    expect(createdUser).to.be.an("object");
  });
  it("returns request validation errors for not acceptable user", async () => {
    const res = await runRequest(makeBodyRequest(endpoint, badUser));
    expect(res.body).have.a.property("errors");
    expect(res.body.errors).to.be.an("array");
    expect(res.statusCode).to.equal(400);
  });
  it("does not add a bad new user to database", async () => {
    const createdBadeUser = await db.usersCollection.findOne({
      email: badUser.email,
    });
    expect(createdBadeUser).to.be.null;
  });
  it("returns status code 409 if email already exists", async () => {
    const res = await runRequest(makeBodyRequest(endpoint, user));
    expect(res.statusCode).to.equal(409);
  });
  it("does not add a new user to database if email already exists", async () => {
    const count = await db.usersCollection.countDocuments({
      email: user.email,
    });
    expect(count).to.be.equal(1);
  });
  it("returns consistent error object on errors", async () => {
    const res = await runRequest(makeBodyRequest(endpoint, badUser, "post"));
    expect(res).to.satisfyApiSpec;
  });
};

describe("Users API", () => {
  // omit properties
  const exampleUsers = mockData.map(({ _id, password, ...user }) => user);
  before((done) => {
    createTestServer()
      .then((s) => {
        server = s;
        db.usersCollection.insertMany(mockData);
        done();
      })
      .catch(done);
  });

  after(async () => {
    await db.database.dropDatabase();
    await db.disconnect();
    await server.close();
    // process.exit(0);
  });

  describe("Test database", () => {
    it("has mock data", (done) => {
      db.usersCollection
        .countDocuments()
        .then((count) => {
          expect(count).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe("# GET /users", () => {
    const endpoint = "/users";
    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(makeBaseRequest(endpoint));
      expect(res).to.satisfyApiSpec;
      expect(res.statusCode).to.equal(200);
    });
    it("returns users collection", async () => {
      const res = await runRequest(makeBaseRequest(endpoint));
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("collection");
      expect(res.body).to.have.property("collectionSize");
      expect(res.body.collection.length).to.equal(mockData.length);
    });
    it("applies projection correctly", async () => {
      const res = await runRequest(makeBaseRequest("/users?fields=email"));
      const userObject = res.body.collection[0];
      expect(res.statusCode).to.equal(200);
      expect(userObject).to.be.an("object");
      expect(userObject).to.have.property("email");
      expect(Object.keys(userObject)).to.have.lengthOf(1);
    });
    it("applies page size correctly", async () => {
      const {
        body: { collectionSize, collection },
      } = await runRequest(makeBaseRequest("/users?pageSize=5"));
      expect(collectionSize).to.equal(5);
      expect(collection).to.have.lengthOf(5);
    });
    describe("- Pagination", () => {
      const pageSize = 4;
      const expectedPagesCount = Math.ceil(mockData.length / pageSize);
      const requestPage = (cursor = "") =>
        runRequest(makeBaseRequest("/users", "get", { cursor, pageSize }));
      let nextPageCursor = "";
      for (let p = 1; p <= expectedPagesCount; p++) {
        describe(`- page ${p}/${expectedPagesCount}`, () => {
          it(`returns the expected items for page ${p}/${expectedPagesCount}`, async () => {
            const { body } = await requestPage(nextPageCursor);
            const currentUserPage = exampleUsers
              .slice()
              .reverse()
              .slice(pageSize * (p - 1), pageSize * p);
            expect(body.collection).to.eql(currentUserPage);
          });
          if (p === expectedPagesCount) {
            it(`does not return the next page cursor for last/one page ${p}/${expectedPagesCount}`, async () => {
              const { body } = await requestPage(nextPageCursor);
              expect(body).to.not.have.property("cursor");
            });
          } else {
            it(`returns the next page cursor for page ${p}/${expectedPagesCount}`, async () => {
              const { body } = await requestPage(nextPageCursor);
              nextPageCursor = body.cursor;
              expect(body).to.have.property("cursor");
              expect(body.cursor).to.not.be.undefined;
            });
          }
        });
      }
    });
  });

  describe("# GET /users/{id}", () => {
    const chosenUser = exampleUsers[2];
    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(makeBaseRequest(`/users/${chosenUser.id}`));
      expect(res).to.satisfyApiSpec;
      expect(res.statusCode).to.equal(200);
    });
    it("returns user by id", async () => {
      const { body } = await runRequest(
        makeBaseRequest(`/users/${chosenUser.id}`)
      );
      expect(body).to.be.an("object");
      expect(body).to.eql(chosenUser);
    });
    it("returns status code 404 if user not found by id", async () => {
      const res = await runRequest(
        makeBaseRequest(`/users/user:uuid:67df82e8-ecbe-5c70-a8f4-e59964e188b9`)
      );
      expect(res.statusCode).to.equal(404);
    });
    it("returns consistent error object on errors", async () => {
      const res = await runRequest(makeBaseRequest(`/users/notExists`));
      expect(res).to.satisfyApiSpec;
    });
    it("applies projection correctly", async () => {
      const res = await runRequest(
        makeBaseRequest(`/users/${chosenUser.id}?fields=email`)
      );
      const userObject = res.body;
      expect(userObject).to.be.an("object");
      expect(userObject).to.have.property("email");
      expect(Object.keys(userObject)).to.have.lengthOf(1);
    });
  });
  describe("# DELETE /users/{id}", () => {
    const chosenUser = exampleUsers[7];
    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(
        makeBaseRequest(`/users/${chosenUser.id}`, "delete")
      );
      expect(res.statusCode).to.equal(200);
      expect(res).to.satisfyApiSpec;
    });
    it("removes user from database", async () => {
      const deletedUser = await db.usersCollection.findOne({
        id: chosenUser.id,
      });
      expect(deletedUser).to.be.null;
    });
    it("returns status code 404 for currently deleted user", async () => {
      const res = await runRequest(
        makeBaseRequest(`/users/${chosenUser.id}`, "delete")
      );
      expect(res.statusCode).to.equal(404);
    });
    it("returns consistent error object on errors", async () => {
      const res = await runRequest(
        makeBaseRequest(`/users/notExists`, "delete")
      );
      expect(res).to.satisfyApiSpec;
    });
  });
  describe("# POST /users", () => {
    const user = {
      username: "New user",
      email: "email@test.com",
      password: "123456",
    };
    // user without a email, password or username is a bad user
    const badUser = {
      username: "Bad user",
      email: "baduser@test.com",
    };
    userCreationTests("/users", user, badUser);
  });
  describe("# PUT /users/{id}", () => {
    const chosenUser = exampleUsers[0];
    const user = {
      ...chosenUser,
      username: "Updated user",
      password: "123456",
      imageId: "test",
    };
    const putRequestUser = {
      email: user.email,
      username: user.username,
      password: user.password,
      imageId: user.imageId,
    };
    // user without a email, password or username is a bad user
    const badUser = {
      username: "Bad user",
      email: "baduser@test.com",
    };
    const endpoint = `/users/${chosenUser.id}`;

    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(
        makeBodyRequest(endpoint, putRequestUser, "put")
      );
      expect(res).to.satisfyApiSpec;
      expect(res.status).to.equal(200);
    });
    it("replaces the user in the database", async () => {
      const updatedUser = await db.usersCollection.findOne(
        {
          email: user.email,
        },
        { projection: { _id: 0, password: 0 } }
      );
      const { email, username, imageId, creationDate, id } = user;
      expect(updatedUser).to.eql({
        email,
        username,
        imageId,
        creationDate,
        id,
      });
    });
    it("creates new user if one with the id does not exist", async () => {
      const newUser = {
        username: "Should create me",
        email: "emailkek@test.com",
        password: "123456",
      };
      const res = await runRequest(
        makeBodyRequest(
          "/users/user:uuid:22e4dc25-3169-47d5-af7c-3efe286decc5",
          newUser,
          "put",
          false
        )
      );
      const createdUser = await db.usersCollection.findOne({
        email: newUser.email,
      });
      expect(res.statusCode).to.equal(200);
      expect(createdUser).to.not.be.null;
    });
    it("returns request validation errors for unacceptable user", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, badUser, "put"));
      expect(res.body).to.have.a.property("errors");
      expect(res.body.errors).to.be.an("array");
      expect(res.statusCode).to.equal(400);
    });
    it("does not replace the user with the unacceptable one in the database", async () => {
      const createdBadeUser = await db.usersCollection.findOne({
        email: badUser.email,
      });
      expect(createdBadeUser).to.be.null;
    });
    it("returns status code 409 if email already exists", async () => {
      const res = await runRequest(
        makeBodyRequest(
          endpoint,
          { ...putRequestUser, email: exampleUsers[5].email },
          "put"
        )
      );
      expect(res.statusCode).to.equal(409);
    });
    it("does not add a new user to database if email already exists", async () => {
      const count = await db.usersCollection.countDocuments({
        email: user.email,
      });
      expect(count).to.be.equal(1);
    });
    it("returns consistent error object on errors", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, badUser, "put"));
      expect(res).to.satisfyApiSpec;
    });
  });
  describe("# PATCH /users/{id}", () => {
    const chosenUser = exampleUsers[3];
    const patch = {
      username: "Patched user",
    };
    const badPatch = {
      someNotAllowedProp: "someNotAllowedProp",
    };
    const endpoint = `/users/${chosenUser.id}`;

    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, patch, "patch"));
      expect(res).to.satisfyApiSpec;
    });
    it("patches the user in the database", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, patch, "patch"));
      const updatedUser = await db.usersCollection.findOne({
        id: chosenUser.id,
      });
      expect(res.statusCode).to.equal(200);
      expect(updatedUser.username).to.equal(patch.username);
    });
    it("returns rest validation errors for unacceptable user", async () => {
      const res = await runRequest(
        makeBodyRequest(endpoint, badPatch, "patch")
      );
      expect(res.body).have.a.property("errors");
      expect(res.body.errors).to.be.an("array");
      expect(res.statusCode).to.equal(400);
    });
    it("does not patches the user with the unacceptable one in the database", async () => {
      const createdBadeUser = await db.usersCollection.findOne({
        id: chosenUser.id,
      });
      expect(createdBadeUser).to.not.have.property(badPatch.someNotAllowedProp);
    });
    it("returns status code 409 if email already exists", async () => {
      const res = await runRequest(
        makeBodyRequest(endpoint, { email: exampleUsers[5].email }, "patch")
      );
      expect(res.statusCode).to.equal(409);
    });
    it("does not add a new user to database if email already exists", async () => {
      const count = await db.usersCollection.countDocuments({
        email: exampleUsers[5].email,
      });
      expect(count).to.be.equal(1);
    });
    it("returns consistent error object on errors", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, badPatch, "put"));
      expect(res).to.satisfyApiSpec;
    });
    it("returns status code 404 if user not found by id", async () => {
      const res = await runRequest(
        makeBodyRequest(
          `/users/user:uuid:00000000-0000-0000-0000-000000000000`,
          patch,
          "patch"
        )
      );
      expect(res.statusCode).to.equal(404);
    });
  });

  /**
   * Use this user to test registration, login and verify functionality
   */
  const testUser = {
    email: "test@email.com",
    username: "Test user",
    password: "123456",
  };
  describe("# POST /users/login", () => {
    const credentials = {
      email: testUser.email,
      password: testUser.password,
    };
    const endpoint = "/users/login";
    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, credentials));
      expect(res).to.satisfyApiSpec;
    });
    it("logins successful with the test user", async () => {
      // first register the test user
      await runRequest(makeBodyRequest("/users", testUser));
      // then login
      const res = await runRequest(makeBodyRequest(endpoint, credentials));
      expect(res.statusCode).to.equal(200);
    });
    it("returns token on successful login", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, credentials));
      // set token to be able to test verification
      testUser.token = res.body.token;
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property("token");
    });
    it("rejects login with wrong email", async () => {
      const res = await runRequest(
        makeBodyRequest(endpoint, {
          ...credentials,
          email: "wrong@email.com",
        })
      );
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.not.have.property("token");
    });
    it("rejects login with wrong password", async () => {
      const res = await runRequest(
        makeBodyRequest(endpoint, { ...credentials, password: "wrong" })
      );
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.not.have.property("token");
    });
    // TODO: see https://github.com/openapi-library/OpenAPIValidators/issues/226
    /* it("returns consistent error object on errors", async () => {
      const res = await runRequest(makeBodyRequest(endpoint, {}));
      expect(res).to.satisfyApiSpec;
    }); */
  });
  describe("# POST /users/verify", () => {
    const endpoint = "/users/verify";
    it("satisfies OpenAPI spec", async () => {
      const res = await runRequest(makeVerifyRequest(endpoint, testUser.token));
      expect(res).to.satisfyApiSpec;
      expect(res.statusCode).to.equal(200);
    });
    it("rejects verification if invalid token supplied", async () => {
      const res = await runRequest(makeVerifyRequest(endpoint, "wrong_token"));
      expect(res.statusCode).to.equal(401);
      expect(res.body).to.be.an("object").that.have.property("code");
    });
    it("returns consistent error object on errors", async () => {
      const res = await runRequest(makeVerifyRequest(endpoint, "wrongToken"));
      expect(res).to.satisfyApiSpec;
    });
  });
});
