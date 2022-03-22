import analytics from "@/api/analytics";
import profiling from "@/api/profiling";
import history from "@/api/history";
import search from "@/api/search";
import divaLakeAdapter from "@/api/adapters/divaLake";
import urbanPulseAdapter from "@/api/adapters/urbanPulse";
import axios from "@/api/axios";
import fetchWrapper from "@/api/fetchWrapper";
import datanetwork from "@/api/datanetwork";
import entities from "@/api/entities";
import "@/api/socket";

// injected as "Vue.prototype.$api = api" in main.js
export default {
  axios,
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
