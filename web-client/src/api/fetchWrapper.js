let endpoint = process.env.VUE_APP_API_GATEWAY_URL || "http://localhost:8000";
const JWTToken = localStorage.getItem("jwt");

export default {
  baseURL: endpoint,
  headers: {
    "Content-type": "application/json",
    Authorization: JWTToken ? `Bearer ${JWTToken}` : "",
    Accept: "application/json",
  },
  fetch(path, data = {}, signal = null) {
    return fetch(`${this.baseURL}/${path}`, {
      method: "POST",
      headers: this.headers,
      mode: "cors",
      signal: signal,
      body: JSON.stringify(data),
    });
  },
  setAuthHeader(token) {
    this.headers.Authorization = `Bearer ${token}`;
  },
};

export { endpoint };
