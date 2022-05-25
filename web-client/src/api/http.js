import axios from "axios";
import axiosRetry from "axios-retry";
import api from "@/api/index";

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

let endpoint = process.env.VUE_APP_API_GATEWAY_URL || "http://localhost:8000";
const JWTToken = localStorage.getItem("jwt");

export default {
  axios: axios.create({
    baseURL: endpoint,
    headers: {
      Authorization: JWTToken ? `Bearer ${JWTToken}` : "",
      "Content-Type": "application/json",
    },
  }),
  setAuthorizationHeader: (token = "") => {
    api.axios.defaults.headers["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  },
  endpoint,
};
