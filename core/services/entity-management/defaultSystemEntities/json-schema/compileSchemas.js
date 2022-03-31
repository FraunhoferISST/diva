const $RefParser = require("@apidevtools/json-schema-ref-parser");
const path = require("path");

$RefParser
  .dereference("artifacts/entity.json", {
    dereference: { circular: false },
  })
  .then((schema) => {
    console.log(schema);
  });
