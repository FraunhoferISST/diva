import http from "@/api/http";

const axios = http.axios;

const getByIdIfExists = (id, query, path) =>
  axios.get(`${path}/${id}`, { params: query }).catch((e) => {
    if (e?.response?.status === 404) {
      return null;
    }
    throw e;
  });

const getByIdIgnoringErrors = (
  id,
  path,
  { query = {}, errorsToIgnore = [404, 403], onIgnoredError = () => {} } = {}
) =>
  axios.get(`${path}/${id}`, { params: query }).catch((e) => {
    if (errorsToIgnore.includes(e?.response?.status)) {
      return onIgnoredError(e, id);
    }
    throw e;
  });

export default (path) => ({
  get: (query) => axios.get(path, { params: query }),
  getById: (id, query) => axios.get(`${path}/${id}`, { params: query }),
  getManyById: async (ids, query, config) => {
    const uniqueIds = [...new Set(ids)];
    const entities = [
      ...(await Promise.all(
        uniqueIds.map((id) =>
          getByIdIgnoringErrors(id, path, { query, ...config })
        )
      )),
    ].map((res) => res?.data ?? res ?? null);
    return entities.filter((entity) => entity);
  },
  getByIdIfExists: (id, query) => getByIdIfExists(id, query, path),
  getByIdIgnoringErrors: (id, config) =>
    getByIdIgnoringErrors(id, path, config),
  update: (id, data) => axios.put(`${path}/${id}`, data),
  create: (data) => axios.post(path, data),
  patch: (id, patch) => axios.patch(`${path}/${id}`, patch),
  delete: (id) => axios.delete(`${path}/${id}`),

  uploadImage: (id, image) => {
    const formData = new FormData();
    formData.append("image", image);
    return axios.post(`${path}/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getImageById: (id, imageId) => axios.get(`${path}/${id}/images/${imageId}`),
  deleteImage: (id, imageId) => axios.delete(`${path}/${id}/images/${imageId}`),
  deleteImageIfExists: (id, imageId) =>
    axios.delete(`${path}/${id}/images/${imageId}`).catch((e) => {
      if (e?.response?.status === 404) {
        return null;
      }
      throw e;
    }),
});
