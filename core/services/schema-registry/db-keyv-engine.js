const path = require("path");
const glob = require("glob");
const Keyv = require("keyv");
const mime = require("mime");
const fs = require("fs");
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

  // fs.readdirSync(path.join(__dirname, "../../schemata"));
  if (process.pkg?.entrypoint) {
    // schemaFolder = path.join(process.cwd(), schemaFolder);
  }
  console.log(schemaFolder);
  console.log(process.cwd());

  fs.readdir(__dirname, (err, files) => {
    files.forEach((file) => {
      console.log(file);
    });
  });

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
