import axios from "@/api/axios";

export default (path) => ({
  get: (query) => axios.get(path, { params: query }),
  getById: (id, query) => axios.get(`${path}${id}`, { params: query }),
  getByIdIfExists: (id, query) =>
    axios.get(`${path}${id}`, { params: query }).catch((e) => {
      if (e?.response?.status === 404) {
        return null;
      }
      throw e;
    }),
  update: (id, data) => axios.put(`${path}${id}`, data),
  create: (data) => axios.post(path, data),
  patch: (id, patch) => axios.patch(`${path}${id}`, patch),
});
