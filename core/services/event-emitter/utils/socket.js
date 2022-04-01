const io = require("socket.io")();
const MessagesValidator = require("@diva/common/messaging/MessagesValidator");
const { log } = require("./logger");

const messagesValidator = new MessagesValidator();

const EVENT_EMITTER_SPECIFICATION = "event-emitter-api";
const PORT = process.env.PORT || 3009;

const DEFAULT_CHANNEL = "default";
const ENTITY_SUBSCRIBE_REQUEST = "entitySubscribeRequest";
const ENTITY_UNSUBSCRIBE_REQUEST = "entityUnsubscribeRequest";
const ENTITY_SUBSCRIBE_RESPONSE = "entitySubscribeResponse";
const ENTITY_UNSUBSCRIBE_RESPONSE = "entityUnsubscribeResponse";
const ENTITY_EVENT = "entityEvent";

const connectionHandler = (client) => {
  log.info(`🔌 Client "${client.id}" connected`);

  client.on(ENTITY_SUBSCRIBE_REQUEST, (entityId) => {
    try {
      messagesValidator.validate(EVENT_EMITTER_SPECIFICATION, entityId, {
        messageName: ENTITY_SUBSCRIBE_REQUEST,
        channel: DEFAULT_CHANNEL,
        operation: "publish",
      });

      client.join(`entity.events.${entityId}`);

      client.emit(ENTITY_SUBSCRIBE_RESPONSE, {
        type: "success",
        entity: entityId,
        message: `subscribed to "${entityId}" events`,
      });
    } catch (e) {
      client.emit(ENTITY_SUBSCRIBE_RESPONSE, {
        type: "failure",
        message: `🛑 Could not subscribed to "${entityId}" events`,
      });

      log.error(`🛑 ${e}`);
    }
  });

  client.on(ENTITY_UNSUBSCRIBE_REQUEST, (entityId) => {
    try {
      messagesValidator.validate(EVENT_EMITTER_SPECIFICATION, entityId, {
        messageName: ENTITY_UNSUBSCRIBE_REQUEST,
        channel: DEFAULT_CHANNEL,
        operation: "publish",
      });

      client.leave(`entity.events.${entityId}`);

      client.emit(
        ENTITY_UNSUBSCRIBE_RESPONSE,
        JSON.stringify({
          type: "success",
          entity: entityId,
          message: `unsubscribed from "${entityId}" events`,
        })
      );
    } catch (e) {
      client.emit(ENTITY_UNSUBSCRIBE_RESPONSE, {
        type: "failure",
        message: `🛑 Could not unsubscribed from "${entityId}" events`,
      });

      log.error(`🛑 ${e.message} Message: ${JSON.stringify(entityId)}`);
    }
  });

  client.on("disconnect", () => {
    log.info(`🔌 Client "${client.id}" disconnected`);
  });
};

const emitEntityEvent = (payload) => {
  try {
    messagesValidator.validate(EVENT_EMITTER_SPECIFICATION, payload, {
      ...payload,
      messageName: ENTITY_EVENT,
      channel: DEFAULT_CHANNEL,
      operation: "subscribe",
    });
    io.to(`entity.events.${payload.object.id}`).emit(ENTITY_EVENT, payload);

    if (payload.attributedTo) {
      payload.attributedTo.forEach((e) => {
        io.to(`entity.events.${e.object.id}`).emit(ENTITY_EVENT, {
          actor: payload.actor,
          type: "update", // it's always the update for the attributed entity
          ...e,
        });
      });
    }
  } catch (e) {
    log.error(`🛑 ${e.message} Message: ${JSON.stringify(payload)}`);
  }
};

const bootSocket = async () => {
  await messagesValidator.init([{ name: EVENT_EMITTER_SPECIFICATION }]);
  io.on("connection", connectionHandler);
  io.listen(PORT, {
    cors: {
      origin: process.env.CORS_ALLOW_ORIGIN || "*",
    },
  });
  log.info(`✅ Websocket listening on port ${PORT} 🌐`);
};

module.exports = {
  bootSocket,
  connectionHandler,
  emitEntityEvent,
};
