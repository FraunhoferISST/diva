import Vue from "vue";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
//import { endpoint } from "@/api/axios";

//const urlJoin = require("url-join");

//const gatewayUrl = new URL(endpoint);

Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV !== "production",
    connection: SocketIO(`events.local`, {
      path: "/socket.io",
      autoConnect: false,
      transports: ["polling", "websocket"],
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
