const path = require("path");
const fs = require("fs");
const glob = require("glob");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(`${path.join(__dirname, "db.json")}`);
const db = low(adapter);

// Remove existing schemata from cache file
db.get("schemata").remove().write();

// Set some defaults (required if your JSON file is empty)
db.defaults({ schemata: [] }).write();

const buildInMemoryDb = () => {
  console.log(`👀 Read Schemata`);
  const schemaFolder = path.join(
    __dirname,
    process.env.SCHEMA_DIR || "schemata"
  );
  const schemataPaths = glob.sync(`${schemaFolder}/**/*.json`);

  schemataPaths.forEach((p) => {
    const schema = fs.readFileSync(p);

    // Add a schema
    db.get("schemata")
      .push({
        name: path.parse(p).name,
        schema: JSON.parse(schema),
      })
      .write();
  });
};

const getSchemaByName = (name) => {
  const res = db.get("schemata").find({ name }).value();

  // TODO: check if there is a result?

  return res;
};

module.exports = {
  buildInMemoryDb,
  getSchemaByName,
};
