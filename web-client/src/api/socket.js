import { io } from "socket.io-client";
import urlJoin from "url-join";

const endpoint = process.env.VUE_APP_API_GATEWAY_URL || "http://localhost:8000";

const gatewayUrl = new URL(endpoint);

const socket = io(gatewayUrl.origin, {
  reconnectionDelayMax: 10000,
  path: urlJoin(`${gatewayUrl.pathname}`, "events"),
  autoConnect: false,
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
  auth: {
    token: localStorage.getItem("jwt"),
  },
});

export default {
  socket,
  setAuthorizationHeader: (token = "") => {
    socket.auth.token = token;
    socket.io.opts.auth.token = token;
    socket.io.opts.extraHeaders.Authorization = `Bearer ${token}`;
  },
  connect: () => socket.connect(),
  close: () => socket.close(),
};
