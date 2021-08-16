import Vuex from "vuex";
import Vue from "vue";
import ClientService from "@/services/ClientService";
import ProviderService from "@/services/ProviderService";
import { onLoading } from "@/utils";

Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    clients: [],
    providers: [],
    isLoading: false,
    requestErrors: {
      email: "",
      phone: "",
      provider: "",
      providers: "",
    },
  },
  getters: {
    clients: (state) => {
      return state.clients;
    },

    providers: (state) => {
      return state.providers;
    },
  },
  mutations: {
    setClients(state, clients) {
      state.clients = clients;
    },

    setProviders(state, providers) {
      state.providers = providers;
    },

    createOrUpdateClient(state, { client, isNewCreate }) {
      if (!isNewCreate) {
        state.clients = state.clients.map(
          (el) => el.id === client.id || client
        );
        return;
      }
      state.clients.push(client);
    },

    deleteClient(state, id) {
      state.clients = state.clients.filter((client) => client.id !== id);
    },

    deleteProvider(state, id) {
      state.providers = state.providers.filter(
        (provider) => provider.id !== id
      );
    },

    createOrUpdateProvider(state, { provider, isNewCreate }) {
      if (!isNewCreate) {
        state.providers = state.providers.map(
          (it) => it.id === provider.id || provider
        );
        return;
      }
      state.providers.push(provider);
    },
    changeLoading(state) {
      state.isLoading = !state.isLoading;
    },
    changeRequestErrors(state, errors) {
      for (const error in errors) {
        errors[error] = "";
      }
      errors.forEach((error) => {
        if (error.param === "email") {
          state.requestErrors.email = error.msg;
        }
        if (error.param.indexOf("providers[") > 0) {
          state.requestErrors.providers = error.msg;
        }
        if (error.param === "phone") {
          state.requestErrors.phone = error.msg;
        }
        if (error.param === "name") {
          state.requestErrors.name = error.msg;
        }
      });
    },
  },

  actions: {
    getClients() {
      return onLoading(
        ClientService.getAllClients()
          .then((res) => {
            this.commit("setClients", res.data);
            return true;
          })
          .catch((rej) => {
            alert("Error while getting clients!");
            console.log(rej);
            return false;
          })
      );
    },

    saveClient(state, form) {
      return onLoading(
        ClientService.createOrUpdateClient(form)
          .then((res) => {
            this.commit("createOrUpdateClient", {
              client: res.data,
              isNewCreate: !form.id,
            });
            return true;
          })
          .catch((rej) => {
            this.commit("changeRequestErrors", rej.response.data.errors || []);
            return false;
          })
      );
    },

    deleteClient(state, id) {
      return onLoading(
        ClientService.deleteClientById(id)
          .then((res) => {
            if (res.status === 204) {
              this.commit("deleteClient", id);
            }
            return true;
          })
          .catch((rej) => {
            this.commit("changeRequestErrors", rej.response.data.errors || []);
            return false;
          })
      );
    },

    getProviders() {
      return onLoading(
        ProviderService.getAllProviders()
          .then((res) => {
            this.commit("setProviders", res.data);
            return true;
          })
          .catch((rej) => {
            this.commit("changeRequestErrors", rej.response.data.errors || []);
            return false;
          })
      );
    },

    saveProvider(state, provider) {
      return onLoading(
        ProviderService.createOrUpdateProvider(provider)
          .then((res) => {
            this.commit("createOrUpdateProvider", {
              provider: res.data,
              isNewCreate: !provider.id,
            });
            return true;
          })
          .catch((rej) => {
            alert("Error while saving provider!");
            this.commit("changeRequestErrors", rej.response.data.errors || []);
            return false;
          })
      );
    },

    deleteProvider(state, id) {
      return onLoading(
        ProviderService.deleteProviderById(id)
          .then((res) => {
            if (res.status === 204) {
              this.commit("deleteProvider", id);
            }
            return true;
          })
          .catch((rej) => {
            this.commit("changeRequestErrors", rej.response.data.errors || []);
            return false;
          })
      );
    },

    hasClientWithProvider(state, providerId) {
      return !!state.getters.clients.find(
        (client) =>
          !!client.providers.find((provider) => provider.id === providerId)
      );
    },
  },
});
