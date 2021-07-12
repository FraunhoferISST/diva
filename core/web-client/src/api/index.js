import users from "@/api/users";
import analytics from "@/api/analytics";
import profiling from "@/api/profiling";
import history from "@/api/history";
import resources from "@/api/resources";
import assets from "@/api/assets";
import reviews from "@/api/reviews";
import search from "@/api/search";
import divaLakeAdapter from "@/api/adapters/divaLake";
import urbanPulseAdapter from "@/api/adapters/urbanPulse";
import dscAdapter from "@/api/adapters/dsc";
import axios from "@/api/axios";
import "@/api/socket";

// injected as "Vue.prototype.$api = api" in main.js
export default {
  axios,
  resources,
  users,
  reviews,
  assets,
  analytics,
  profiling,
  history,
  search,
  divaLakeAdapter,
  urbanPulseAdapter,
  dscAdapter,
};
