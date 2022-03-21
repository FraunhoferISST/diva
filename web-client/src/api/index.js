import analytics from "@/api/analytics";
import profiling from "@/api/profiling";
import history from "@/api/history";
import search from "@/api/search";
import divaLakeAdapter from "@/api/adapters/divaLake";
import urbanPulseAdapter from "@/api/adapters/urbanPulse";
import http from "@/api/http";
import fetchWrapper from "@/api/fetchWrapper";
import datanetwork from "@/api/datanetwork";
import entities from "@/api/entities";
import socket from "@/api/socket";

// injected as "Vue.prototype.$api = api" in main.js
export default {
  setAuthorization: (token = "") => {
    fetchWrapper.setAuthorizationHeader(token);
    socket.setAuthorizationHeader(token);
    http.setAuthorizationHeader(token);
  },
  ...socket,
  ...http,
  analytics,
  profiling,
  history,
  search,
  divaLakeAdapter,
  urbanPulseAdapter,
  fetchWrapper,
  datanetwork,
  ...entities,
};
