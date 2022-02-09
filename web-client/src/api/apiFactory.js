import axios from "@/api/axios";

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
  patch: (id, patch) => axios.patch(`${path}${id}`, patch),
  delete: (id) => axios.delete(`${path}${id}`),

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
});
