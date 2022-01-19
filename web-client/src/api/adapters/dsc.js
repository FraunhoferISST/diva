import axios from "@/api/axios";
const routePrefix = "/dscAdapter/resources/";
export default {
  createOffer: (id, policy) => axios.post(`${routePrefix}${id}/offers`, policy),
  updateOffer: (id, offerId, policy) =>
    axios.put(`${routePrefix}${id}/offers/${offerId}`, policy),
  deleteOffer: (id, offerId) =>
    axios.delete(`${routePrefix}${id}/offers/${offerId}`),
};
