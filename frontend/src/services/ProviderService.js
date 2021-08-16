import axios from "axios";

const backendUrl = process.env.BACKEND_URL;
export default {
  getAllProviders() {
    return axios.get(`${backendUrl}/providers`);
  },

  getProviderById(providerId) {
    return axios.get(`${backendUrl}/providers/${providerId}`);
  },

  createOrUpdateProvider(provider) {
    if (provider.id) {
      return axios.put(`${backendUrl}/providers/${provider.id}`, provider);
    }
    return axios.post(`${backendUrl}/providers`, provider);
  },

  deleteProviderById(proivderId) {
    return axios.delete(`${backendUrl}/providers/${proivderId}`);
  },
};
