import axios from "axios";

let endpoint = process.env.VUE_APP_API_GATEWAY_URL || "http://localhost:8000";
const JWTToken = localStorage.getItem("jwt");

const fetchHeaders = new Headers();
fetchHeaders.append("Content-Type", "application/json");
fetchHeaders.append("Authorization", JWTToken ? `Bearer ${JWTToken}` : "");
fetchHeaders.append("Accept", "application/json");

const customFetch = (url, data = {}) =>
  fetch(url, {
    method: "POST",
    headers: fetchHeaders,
    mode: "cors",
    body: JSON.stringify(data),
  });

export default axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: JWTToken ? `Bearer ${JWTToken}` : "",
    "Content-Type": "application/json",
  },
});

export { endpoint, customFetch };
