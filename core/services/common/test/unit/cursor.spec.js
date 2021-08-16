const { expect } = require("chai");

const { encodeCursor, decodeCursor } = require("../../api/cursor");

const email = "test@email.com";
const id = "some:uuid:a4795eec-4ba5-492c-9fcc-5cca897e4f62";
const delimiter = "_";

describe("Utils - Cursor", () => {
  it("encodes the cursor as base64 correctly", () => {
    const expectedCursor =
      "dGVzdEBlbWFpbC5jb21fc29tZTp1dWlkOmE0Nzk1ZWVjLTRiYTUtNDkyYy05ZmNjLTVjY2E4OTdlNGY2Mg==";
    expect(encodeCursor(`${email}${delimiter}${id}`)).to.equal(expectedCursor);
  });
  it("decodes the cursor as base64 correctly", () => {
    const cursor =
      "dGVzdEBlbWFpbC5jb21fc29tZTp1dWlkOmE0Nzk1ZWVjLTRiYTUtNDkyYy05ZmNjLTVjY2E4OTdlNGY2Mg==";
    const decoded = decodeCursor(cursor);
    expect(`${email}_${id}`).to.equal(decoded);
  });
});
