const jsonSchemaValidator = require("@diva/common/JsonSchemaValidator");
const EntityService = require("@diva/common/api/EntityService");
const generateUuid = require("@diva/common/generateUuid");
const { mongoDBConnector } = require("../utils/mongoDbConnectors");
const { collectionsNames } = require("../utils/constants");

const ENTITY_ROOT_SCHEMA = process.env.ENTITY_ROOT_SCHEMA || "entity";
const HISTORY_ROOT_SCHEMA = process.env.HISTORY_ROOT_SCHEMA || "history";

class CustomService extends EntityService {
  constructor(entity) {
    super();
    this.entity = entity;
  }

  async init() {
    await jsonSchemaValidator.init([ENTITY_ROOT_SCHEMA, HISTORY_ROOT_SCHEMA]);
    await mongoDBConnector.connect();
    this.collection = mongoDBConnector.database.collection(this.entity);
    this.historyCollection =
      mongoDBConnector.collections[collectionsNames.HISTORIES_COLLECTION_NAME];
    this.jsonSchemaValidator = jsonSchemaValidator;
  }

  async create(entity, actorId) {
    return super.create(
      {
        ...entity,
        id: generateUuid(this.entity),
        entityType: this.entity,
      },
      actorId
    );
  }

  validate(review) {
    jsonSchemaValidator.validate(ENTITY_ROOT_SCHEMA, review);
  }
}

module.exports = CustomService;
