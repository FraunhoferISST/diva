import http from "@/api/http";
const axios = http.axios;
export default (q, { pageSize = 30, cursor, ...params }) =>
  axios.get("/search", {
    params: {
      ...(q ? { q } : {}),
      pageSize,
      cursor,
      ...params,
    },
  });
