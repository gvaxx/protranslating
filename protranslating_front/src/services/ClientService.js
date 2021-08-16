import axios from "axios";

const backendUrl = process.env.BACKEND_URL;
export default {
  getAllClients() {
    return axios.get(`${backendUrl}/clients`);
  },

  getClientById(clientId) {
    return axios.get(`${backendUrl}/clients/${clientId}`);
  },

  createOrUpdateClient(client) {
    if (client.id) {
      return axios.put(`${backendUrl}/clients/${client.id}`, client);
    }
    return axios.post(`${backendUrl}/clients`, client);
  },

  deleteClientById(clientId) {
    return axios.delete(`${backendUrl}/clients/${clientId}`);
  },
};
