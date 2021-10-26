let endpoint = process.env.VUE_APP_API_GATEWAY_URL || "http://localhost:8000";
const JWTToken = localStorage.getItem("jwt");

const fetchHeaders = new Headers();
fetchHeaders.append("Content-Type", "application/json");
fetchHeaders.append("Authorization", JWTToken ? `Bearer ${JWTToken}` : "");
fetchHeaders.append("Accept", "application/json");

export default {
  baseURL: endpoint,
  headers: fetchHeaders,
  fetch(url, data = {}) {
    return fetch(`${this.baseURL}/${this.path}`, {
      method: "POST",
      headers: this.headers,
      mode: "cors",
      body: JSON.stringify(data),
    });
  },
  setAuthHeader(token) {
    this.headers.Authorization = `Bearer ${token}`;
  },
};

export { endpoint };
