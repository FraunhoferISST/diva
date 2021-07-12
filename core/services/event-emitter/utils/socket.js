const chalk = require("chalk");
const io = require("socket.io")();
const { validateSocketMessage } = require("./messagesValidation");

const PORT = process.env.PORT || 3009;

const DEFAULT_CHANNEL = "default";
const ENTITY_SUBSCRIBE_REQUEST = "entitySubscribeRequest";
const ENTITY_UNSUBSCRIBE_REQUEST = "entityUnsubscribeRequest";
const ENTITY_SUBSCRIBE_RESPONSE = "entitySubscribeResponse";
const ENTITY_UNSUBSCRIBE_RESPONSE = "entityUnsubscribeResponse";
const ENTITY_EVENT = "entityEvent";

const connectionHandler = (client) => {
  console.info(chalk.green(`🔌 Client "${client.id}" connected`));

  client.on(ENTITY_SUBSCRIBE_REQUEST, (entity) => {
    try {
      validateSocketMessage(
        ENTITY_SUBSCRIBE_REQUEST,
        entity,
        DEFAULT_CHANNEL,
        "publish"
      );

      client.join(`entity.events.${entity}`);

      client.emit(ENTITY_SUBSCRIBE_RESPONSE, {
        type: "success",
        entity,
        message: `subscribed to "${entity}" events`,
      });
    } catch (e) {
      client.emit(ENTITY_SUBSCRIBE_RESPONSE, {
        type: "failure",
        message: `🛑 Could not subscribed to "${entity}" events`,
      });

      console.error(`🛑 ${e.message} Message: ${JSON.stringify(entity)}`);
    }
  });

  client.on(ENTITY_UNSUBSCRIBE_REQUEST, (entity) => {
    try {
      validateSocketMessage(
        ENTITY_UNSUBSCRIBE_REQUEST,
        entity,
        DEFAULT_CHANNEL,
        "publish"
      );

      client.leave(`entity.events.${entity}`);

      client.emit(
        ENTITY_UNSUBSCRIBE_RESPONSE,
        JSON.stringify({
          type: "success",
          entity,
          message: `unsubscribed from "${entity}" events`,
        })
      );
    } catch (e) {
      client.emit(ENTITY_UNSUBSCRIBE_RESPONSE, {
        type: "failure",
        message: `🛑 Could not unsubscribed from "${entity}" events`,
      });

      console.error(`🛑 ${e.message} Message: ${JSON.stringify(entity)}`);
    }
  });

  client.on("disconnect", () => {
    console.info(chalk.yellow(`🔌 Client "${client.id}" disconnected`));
  });
};

const emitEntityEvent = (payload) => {
  try {
    validateSocketMessage(ENTITY_EVENT, payload, DEFAULT_CHANNEL, "subscribe");
    io.to(`entity.events.${payload.object.id}`).emit(ENTITY_EVENT, payload);

    if (payload.attributedTo) {
      payload.attributedTo.forEach((e) => {
        io.to(`entity.events.${e.object.id}`).emit(ENTITY_EVENT, payload);
      });
    }
  } catch (e) {
    console.error(`🛑 ${e.message} Message: ${JSON.stringify(payload)}`);
  }
};

const bootSocket = async () =>
  new Promise((resolve) => {
    io.on("connection", connectionHandler);
    io.listen(PORT, {
      cors: {
        origin: "*",
      },
    });
    console.info(chalk.blue(`✅ Websocket listening on port ${PORT} 🌐`));
    resolve();
  });

module.exports = {
  bootSocket,
  connectionHandler,
  emitEntityEvent,
};
