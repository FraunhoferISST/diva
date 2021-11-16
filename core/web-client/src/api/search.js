import axios from "@/api/axios";
export default (q, pageSize = 30, cursor) =>
  axios.get("/search", {
    params: {
      ...(q ? { q } : {}),
      pageSize,
      cursor,
    },
  });
