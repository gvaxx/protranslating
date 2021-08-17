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
      name: "",
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
    getProvidersName: (state) => (clientProviders) => {
      if (clientProviders) {
        let clientProviderIds = clientProviders.map((provider) => provider.id);
        let providerNames = [];
        state.providers.forEach(
          (provider) =>
            clientProviderIds.includes(provider.id) &&
            providerNames.push(provider.name)
        );
        return providerNames.join(", ");
      }
      return "";
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
        let index = state.clients.findIndex((it) => it.id === client.id);
        if (index >= 0) {
          state.clients[index] = client;
        }
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
        let index = state.providers.findIndex((it) => {
          console.log(it.id);
          console.log(provider.id);
          return it.id === provider.id;
        });
        console.log(index);
        console.log(state.providers[index]);
        if (index >= 0) {
          state.providers[index] = provider;
        }
        console.log(state.providers);
        return;
      }
      state.providers.push(provider);
    },
    changeLoading(state) {
      state.isLoading = !state.isLoading;
    },
    changeRequestErrors(state, { errors, type }) {
      for (const error in this.requestErrors) {
        this.requestErrors[error] = "";
      }
      errors.forEach((error) => {
        if (error.param === "email") {
          state.requestErrors.email = error.msg;
        }
        if (error.param.indexOf("providers[") >= 0) {
          state.requestErrors.providers = error.msg;
        }
        if (error.param === "phone") {
          state.requestErrors.phone = error.msg;
        }
        if (error.param === "name") {
          if (type === "client") state.requestErrors.name = error.msg;
          if (type === "provider") state.requestErrors.provider = error.msg;
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
            this.commit("changeRequestErrors", {
              errors: rej.response.data.errors || [],
              type: "client",
            });
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
            this.commit("changeRequestErrors", {
              errors: rej.response.data.errors || [],
              type: "client",
            });
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
            this.commit("changeRequestErrors", {
              errors: rej.response.data.errors || [],
              type: "provider",
            });
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
            this.commit("changeRequestErrors", {
              errors: rej.response.data.errors || [],
              type: "provider",
            });
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
            this.commit("changeRequestErrors", {
              errors: rej.response.data.errors || [],
              type: "provider",
            });
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
