const { expect } = require("chai");
const rewire = require("rewire");
const mockData = require("../utils/mockData");

const UsersController = rewire(`${process.cwd()}/controllers/Users.js`);

describe("Users Controller", () => {
  it("encodes the cursor as base64 correctly", () => {
    const { email } = mockData[0];
    const { id } = mockData[0];
    const delimiter = "_";
    const expectedCursor =
      "bXNsb3NzMEBmZWVkYnVybmVyLmNvbV91cm46dXVpZDozOTk1MGJlNS01MDFmLTRmOWUtYWZmOC0xYWU4ODk0NDFhYzU=";
    const encodeCursor = UsersController.__get__("encodeCursor");
    expect(encodeCursor(`${email}${delimiter}${id}`)).to.equal(expectedCursor);
  });
  it("decodes the cursor as base64 correctly", () => {
    const { email } = mockData[0];
    const { id } = mockData[0];
    const cursor =
      "bXNsb3NzMEBmZWVkYnVybmVyLmNvbV91cm46dXVpZDozOTk1MGJlNS01MDFmLTRmOWUtYWZmOC0xYWU4ODk0NDFhYzU=";
    const decodeCursor = UsersController.__get__("decodeCursor");
    const [expectedEmail, expectedId] = decodeCursor(cursor);
    expect(expectedEmail).to.equal(email);
    expect(expectedId).to.equal(id);
  });
});
