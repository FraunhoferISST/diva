const path = require("path");
const glob = require("glob");
const Keyv = require("keyv");
const mime = require("mime");
const fs = require("fs");
const { logger: log } = require("@diva/common/logger");
const { schemaNotFoundError } = require("./errors");

let WORK_DIR = process.cwd();
const schemataDir = "schemata";
let schemataRootPath = path.join(WORK_DIR, schemataDir);

if (process.pkg?.entrypoint) {
  const pkgEntryPoint = process.pkg?.entrypoint ?? "";
  WORK_DIR = pkgEntryPoint.substring(0, pkgEntryPoint.lastIndexOf("/") + 1);
  schemataRootPath = path.join(WORK_DIR, schemataDir);
}

const keyv = new Keyv();
keyv.on("error", (err) => log.error("Connection Error", err));

const loadSchema = async (p) => {
  const payload = fs.readFileSync(`${p}`);
  const mimeType = mime.getType(path.parse(p).ext.substring(1));
  return keyv.set(path.parse(p).name, { mimeType, payload });
};

const buildInMemoryDb = async () => {
  log.info(`👀 Read Schemata`);
  const schemataPaths = glob.sync(`${schemataRootPath}/**/*.*`);
  if (schemataPaths.length === 0) {
    throw Error(`Couldn't find eny schema on "${schemataRootPath}"`);
  }
  const promises = schemataPaths.map(loadSchema);
  await Promise.all(promises);
  log.info("✅ All schemata read into memory");
};

const getSchemaByName = (name) =>
  keyv.get(name).then((schema) => {
    if (!schema) {
      throw schemaNotFoundError;
    }
    return schema;
  });

module.exports = {
  db: keyv,
  buildInMemoryDb,
  getSchemaByName,
};
