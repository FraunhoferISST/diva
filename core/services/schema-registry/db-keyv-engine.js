const path = require("path");
const fs = require("fs");
const glob = require("glob");
const Keyv = require("keyv");
const mime = require("mime");
const { schemaNotFoundError } = require("./errors");

const keyv = new Keyv();
keyv.on("error", (err) => console.log("Connection Error", err));

const loadSchema = async (p) => {
  const payload = fs.readFileSync(`${p}`);
  const mimeType = mime.getType(path.parse(p).ext.substring(1));
  return keyv.set(path.parse(p).name, { mimeType, payload });
};

const buildInMemoryDb = async () => {
  console.log(`👀 Read Schemata`);
  const schemaFolder = path.join(process.env.SCHEMA_DIR || "../../schemata");

  try {
    const schemataPaths = glob.sync(`${schemaFolder}/**/*.*`);
    const promises = schemataPaths.map(loadSchema);
    await Promise.all(promises);
    console.log("✅ All schemata read into memory");
  } catch (e) {
    console.error(`🛑 Error: ${e}`);
    process.exit(1);
  }
};

const getSchemaByName = async (name) =>
  keyv.get(name).then((schema) => {
    if (!schema) {
      throw schemaNotFoundError;
    }
    return schema;
  });

module.exports = {
  buildInMemoryDb,
  getSchemaByName,
};
