<template>
  <div class="root">
    <table class="table table-bordered caption-top">
      <caption>
        <div class="table-name">
          <HeaderText text="Clients" />
        </div>
        <div class="add-client">
          <Button @click="edit" text="New Client" />
        </div>
      </caption>
      <thead>
        <tr class="headers">
          <th v-for="header in headers" v-bind:key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" v-bind:key="client.id">
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td>{{ getProvidersName(client.providers) }}</td>
          <td><a href="#" v-on:click="edit(client)">Edit</a></td>
        </tr>
      </tbody>
    </table>
    <Form v-if="showEdit" v-bind:client="this.editClient" @close="hidePopup" />
  </div>
</template>

<script>
import Form from "@/components/Form";
import Button from "@/components/Button";
import HeaderText from "@/components/HeaderText";
import { mapActions, mapState } from "vuex";
export default {
  name: "Root",
  components: {
    Form,
    Button,
    HeaderText,
  },
  data() {
    return {
      showEdit: false,
      showCreate: false,
      editClient: {},
      headers: ["Name", "Email", "Phone", "Providers", ""],
    };
  },
  computed: {
    ...mapState(["clients", "providers"]),
  },

  created() {
    this.getClients();
    this.getProviders();
  },

  methods: {
    ...mapActions(["getClients", "getProviders"]),

    edit(client) {
      this.editClient = client;
      this.showPopup();
    },

    create() {
      this.editClient = {};
      this.showPopup();
    },

    getProvidersName(clientProviders) {
      if (clientProviders) {
        let clientProviderIds = clientProviders.map((provider) => provider.id);
        let providerNames = [];
        this.providers.forEach(
          (provider) =>
            clientProviderIds.includes(provider.id) &&
            providerNames.push(provider.name)
        );
        return providerNames.join(", ");
      }
      return "";
    },

    showPopup() {
      this.showEdit = true;
    },

    hidePopup() {
      this.showEdit = false;
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
table {
  padding: 0 10%;
}
.headers {
  background-color: #e6e6e6;
  background-repeat: no-repeat;
  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    from(#ffffff),
    color-stop(0.25, #ffffff),
    to(#e6e6e6)
  );
  padding: 4px 14px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
  color: #333333;
  line-height: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition: 0.1s linear all;
}
.table-name {
  float: left;
  margin-left: 10px;
}
table {
  width: 97%;
  margin: 10px auto auto auto;
  text-align: left;
}
.root {
  padding: 1em;
  width: 70%;
  margin: auto;
}

caption {
  background-color: #f0f5f9;
  padding-bottom: 0;
  border: 1px solid #dee2e6;
}
.add-client {
  margin: 0 10px;
  float: right;
  border-bottom: none;
  width: 100px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.table-bordered {
  font-size: 0.9rem;
}
</style>
