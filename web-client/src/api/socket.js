import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import { io } from "socket.io-client";
import { endpoint } from "@/api/axios";

const urlJoin = require("url-join");

const gatewayUrl = new URL(endpoint);

export const socket = io(gatewayUrl.origin, {
  reconnectionDelayMax: 2000,
  path: urlJoin(`${gatewayUrl.pathname}`, "events"),
  autoConnect: false,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
  auth: {
    token: localStorage.getItem("jwt"),
  },
});

socket.connect();

/*export const socket = SocketIO(gatewayUrl.origin, {
  path: urlJoin(`${gatewayUrl.pathname}`, "events"),
  autoConnect: false,
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    },
  },
});*/

/*Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV !== "production",
    connection: socket,
  })
);*/
