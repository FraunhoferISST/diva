import axios from "@/api/axios";

export default {
  distributionOfEntities: () => axios.get("/analytics/distributionOfEntities"),
  distributionOfResourceMimeTypes: () =>
    axios.get("/analytics/distributionOfResourceMimeTypes"),
  distributionOfResourceTypes: () =>
    axios.get("/analytics/distributionOfResourceTypes"),
  averageRating: (id) => axios.get(`/analytics/resources/${id}/rating`),
};
