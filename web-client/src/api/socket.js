import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import { endpoint } from "@/api/axios";

const urlJoin = require("url-join");

const gatewayUrl = new URL(endpoint);

Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV !== "production",
    connection: SocketIO(gatewayUrl.origin, {
      path: urlJoin(`${gatewayUrl.pathname}`, "events"),
      autoConnect: false,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        },
      },
    }),
  })
);
