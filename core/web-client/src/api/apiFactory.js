import axios from "@/api/axios";
let patchDisabledEnv = process.env.VUE_APP_DISABLE_PATCH || "patch_available";
let patchDisabled = patchDisabledEnv.toString().toLowerCase() === "true";

const getByIdIfExists = (id, query, path) =>
  axios.get(`${path}${id}`, { params: query }).catch((e) => {
    if (e?.response?.status === 404) {
      return null;
    }
    throw e;
  });

export default (path) => ({
  get: (query) => axios.get(path, { params: query }),
  getById: (id, query) => axios.get(`${path}${id}`, { params: query }),
  getManyById: async (ids, query) => {
    const uniqueIds = [...new Set(ids)];
    const entities = [
      ...(await Promise.all(
        uniqueIds.map((id) => getByIdIfExists(id, query, path))
      )),
    ].map((res) => res?.data ?? null);
    return entities.filter((entity) => entity);
  },
  getByIdIfExists: (id, query) => getByIdIfExists(id, query, path),
  update: (id, data) => axios.put(`${path}${id}`, data),
  create: (data) => axios.post(path, data),
  patch: (id, patch) =>
    axios[patchDisabled ? "post" : "patch"](`${path}${id}`, patch),
  delete: (id) => axios.delete(`${path}${id}`),
});
