import axios from "axios";

let endpoint = process.env.VUE_APP_API_GATEWAY_URL || "http://localhost:8000";
const JWTToken = localStorage.getItem("jwt");

export default axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: JWTToken ? `Bearer ${JWTToken}` : "",
    "Content-Type": "application/json",
  },
});

export { endpoint };
