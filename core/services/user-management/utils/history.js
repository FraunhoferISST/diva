const _ = require("lodash");
const hasha = require("hasha");
const jsondiffpatch = require("jsondiffpatch");

const { generateHistoryId } = require("./util");
const { validateHistorySchema } = require("./validation/jsonSchemaValidation");

const jdp = jsondiffpatch.create({
  objectHash(obj) {
    const newObj = _(obj).toPairs().sortBy(0).fromPairs().value();
    const hash = hasha(JSON.stringify(newObj), { algorithm: "sha256" });
    return hash;
  },
  arrays: {
    detectMove: true,
    includeValueOnMove: false,
  },
  textDiff: {
    minLength: 60,
  },
  propertyFilter(name) {
    return name.slice(0, 1) !== "$";
  },
  cloneDiffValues: false,
});

const buildHistoryEntity = (oldObj, newObj, actorId) => ({
  id: generateHistoryId(),
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  creatorId: actorId,
  entityType: "history",
  belongsTo: newObj.id,
  delta: jdp.diff(oldObj, newObj) || {},
});

const generateHistoryEntity = (oldObj, newObj, actorId) => {
  const historyEntry = buildHistoryEntity(oldObj, newObj, actorId);
  validateHistorySchema(historyEntry);
  return historyEntry;
};

module.exports = {
  generateHistoryEntity,
};
