<template>
  <section class="background">
    <Loading v-if="isLoading" />
    <div class="control">
      <div class="form-header">
        <HeaderText :text="title" />
      </div>
      <div class="form-body">
        <Input v-model="form.name" label="Name:" input-id="name" />
        <Input
          v-model="form.email"
          label="Email:"
          input-id="email"
          @change="emailValidation"
          :invalid-text="errors.email"
        />
        <Input
          v-model="form.phone"
          label="Phone:"
          input-id="phone"
          @change="phoneValidation"
          :invalid-text="errors.phone"
        />
        <Input
          v-model="newProviderName"
          label="Provider:"
          button-enabled="true"
          @click="saveProviderClick"
          input-id="new-provider"
          button-text="Add Provider"
          :invalid-text="errors.provider"
        />
        <div class="provider">
          <div class="provider-border">
            <div v-for="provider in providers" v-bind:key="provider.id">
              <section
                v-if="!editProvider || editProvider.id !== provider.id"
                class="provider-input"
              >
                <input
                  type="checkbox"
                  :id="provider.id"
                  :value="provider.id"
                  v-model="checkedProviders"
                />
                <label :for="provider.id">{{ provider.name }}</label>
                <a
                  class="edit-provider-click"
                  v-on:click="changeInputProviderClick(provider.id)"
                  href="/#"
                >
                  <img src="@/assets/edit.png" />
                </a>
                <a
                  class="delete-provider-click"
                  v-on:click="deleteProviderClick(provider.id)"
                  href="/#"
                >
                  <img src="@/assets/delete.png" />
                </a>
              </section>
              <section
                v-if="editProvider && editProvider.id === provider.id"
                class="provider-input"
              >
                <div class="provider-input-update-text">
                  <input type="text" v-model="editProvider.name" />
                </div>
                <a
                  class="confirm-provider-click"
                  v-on:click="saveProviderClick(editProvider)"
                  href="/#"
                >
                  <img src="@/assets/confirm.svg" />
                </a>
                <a
                  class="cancel-provider-click"
                  v-on:click="changeInputProviderClick"
                  href="/#"
                >
                  <img src="@/assets/cancel.jpg" />
                </a>
              </section>
            </div>
            <div v-if="!providers.length" style="text-align: center">
              There is no providers yet!
            </div>
          </div>
          <div v-if="errors.providers" class="invalid">
            {{ errors.providers }}
          </div>
        </div>
      </div>
      <div class="form-footer">
        <div class="form-buttons">
          <Button
            v-if="!isCreate"
            class="form-button delete"
            @click="deleteClientClick"
            text="Delete Client"
            button-class="danger"
          />
          <Button class="form-button close" @click="hidePopup" text="Close" />
          <Button
            class="form-button save"
            @click="saveClientClick"
            :disabled="!isValidClient"
            :text="textSaveButton"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Button from "@/components/Button";
import Input from "@/components/Input";
import HeaderText from "@/components/HeaderText";
import Loading from "@/components/Loading";
import { mapState, mapActions } from "vuex";

export default {
  name: "Form",
  components: {
    Button,
    Input,
    HeaderText,
    Loading,
  },
  data() {
    return {
      form: {
        name: "",
        id: "",
        phone: "",
        email: "",
      },
      errors: {
        email: "",
        phone: "",
        provider: "",
        providers: "",
      },
      newProviderName: "",
      editProvider: false,
      checkedProviders: [],
    };
  },
  computed: {
    ...mapState(["providers", "isLoading", "requestErrors"]),
    isValidClient() {
      return !this.errors.email && !this.errors.phone;
    },

    isValidProvider() {
      return !this.errors.provider;
    },

    isCreate() {
      return !this.client;
    },
    title() {
      if (this.isCreate) return "New client";
      return "Edit client";
    },
    textSaveButton() {
      if (this.isCreate) return "Add client";
      return "Save client";
    },
  },

  props: {
    client: Object,
  },
  methods: {
    ...mapActions([
      "saveClient",
      "deleteClient",
      "saveProvider",
      "deleteProvider",
      "hasClientWithProvider",
    ]),

    deleteProviderClick(providerId) {
      this.deleteProviderValidation(providerId);
      if (this.errors.providers) {
        return;
      }
      this.deleteProvider(providerId);
    },

    changeInputProviderClick(providerId) {
      if (providerId) {
        this.editProvider = Object.assign(
          {},
          this.providers.find((provider) => providerId === provider.id)
        );
        return;
      }
      this.editProvider = false;
    },

    saveProviderClick(provider) {
      if (provider) {
        this.providerValidation(provider.name, "providers");
        if (this.errors.providers) {
          return;
        }
        return this.saveProvider(provider).then((res) => {
          if (res === true) {
            this.changeInputProviderClick();
          }
          if (res === false) {
            this.checkRequestError();
          }
        });
      }

      this.providerValidation(this.newProviderName, provider);
      if (this.errors.provider) {
        return;
      }

      return this.saveProvider({ name: this.newProviderName }).then((res) => {
        if (res === true) this.newProviderName = "";
      });
    },

    hidePopup() {
      this.$emit("close");
    },

    saveClientClick() {
      this.phoneValidation();
      this.emailValidation();
      if (!this.isValidClient) {
        return;
      }
      this.form.providers = this.checkedProviders.map((providerId) => {
        return { id: providerId };
      });
      this.saveClient(this.form).then((res) => {
        if (res === true) {
          this.hidePopup();
        } else {
          this.checkRequestError();
        }
      });
    },

    deleteClientClick() {
      this.deleteClient(this.form.id).then((res) => {
        if (res === true) this.hidePopup();
        console.log(res);
      });
    },

    emailValidation() {
      if (this.errors.email) this.errors.email = "";

      if (this.form.email === "") {
        return (this.errors.email = "Email is required");
      }
      const reg =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!reg.test(this.form.email.toLowerCase())) {
        return (this.errors.email = "Email is invalid");
      }
    },

    phoneValidation() {
      if (this.errors.phone) this.errors.phone = "";

      if (!this.form.phone) return (this.errors.phone = "Phone is required");
      if (this.form.phone.length !== 11) {
        return (this.errors.phone =
          "Telephone number must be in 11-digits format");
      }
      const reg = /^\d+$/;
      if (!reg.test(this.form.phone.toLowerCase())) {
        return (this.errors.phone = "Telephone must contain only digits");
      }
    },

    providerValidation(providerName, errorName) {
      if (this.errors[errorName]) this.errors[errorName] = "";

      if (!providerName) return (this.errors[errorName] = "Name is required");

      if (this.providers.find((provider) => provider.name === providerName)) {
        this.errors[errorName] = "Provider name must be unique";
      }
    },
    deleteProviderValidation(providerId) {
      if (this.hasClientWithProvider(providerId)) {
        this.errors.providers =
          "Provider attached to some clients, you can not delete it";
      }
    },

    checkRequestError() {
      for (const requestError in this.requestErrors) {
        if (this.requestErrors[requestError]) {
          this.errors[requestError] = this.requestErrors[requestError];
        }
      }
    },
  },

  created() {
    if (!this.isCreate) {
      this.form.id = this.client.id;
      this.form.name = this.client.name;
      this.form.email = this.client.email;
      this.form.phone = this.client.phone;
      if (this.client.providers) {
        this.checkedProviders = this.client.providers.map(
          (provider) => provider.id
        );
      }
    }
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.form-footer {
  border-top: gray 1px solid;
  height: 60px;
  display: grid;
}
.form-buttons {
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
}
.provider-input {
  text-align: center;
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  margin: 5px 20px 5px 20px;
  align-content: center;
  justify-content: center;
}
.form-header {
  border-bottom: gray 1px solid;
  height: 60px;
  display: grid;
  grid-template-columns: 1fr 3fr;
}

.form-button {
  margin: auto;
}

.delete {
  grid-column: 1 / 1;
}
img {
  height: 16px;
  width: 16px;
}
.save {
  grid-column: 5 / 5;
}

.close {
  grid-column: 4 / 4;
}

h2 {
  align-self: center;
}
.provider-border {
  grid-column-start: 2;
  border: 2px solid #dadada;
  margin-right: 10px;
  border-radius: 5px;
}

.provider {
  margin-left: 2px;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  grid-gap: 10px;
  text-align: left;
  margin-bottom: 20px;
}

.form-body {
  margin-top: auto;
  margin-bottom: auto;
}
.provider-input-update-text {
  padding-left: 36px;
}

.input-provider {
  display: grid;
}

.control {
  position: fixed;
  top: 86px;
  left: 50%;
  transform: translate(-50%, 0%);
  width: 50%;
  align-content: center;
  background-color: white;
  border: 1px solid #aaa;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-rows: 1fr 8fr 1fr;
}

caption {
  background-color: #f0f5f9;
  padding-bottom: 0;
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
a {
  color: #42b983;
}
input {
  margin: auto;
  height: 0.7rem;
}
[type="text"] {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border-style: solid;
  padding-left: 6px;
}

.edit-provider-click {
  grid-column: 2/2;
}

.delete-provider-click {
  grid-column: 3/3;
}

.invalid {
  width: 100%;
  font-size: 0.75em;
  color: #dc3545;
  text-align: left;
  margin-bottom: -20px;
  grid-column: 2/2;
}
/* Base for label styling */
[type="checkbox"]:not(:checked),
[type="checkbox"]:checked {
  position: absolute;
  left: 0;
  opacity: 0.01;
}
[type="checkbox"]:not(:checked) + label,
[type="checkbox"]:checked + label {
  position: relative;
  padding-left: 2.3em;
  line-height: 1.6;
  cursor: pointer;
}

/* checkbox aspect */
[type="checkbox"]:not(:checked) + label:before,
[type="checkbox"]:checked + label:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.2em;
  width: 1.2em;
  height: 1.2em;
  border: 1px solid #aaa;
  background: #fff;
  border-radius: 0.2em;
  -webkit-transition: all 0.275s;
  transition: all 0.275s;
}

/* checked mark aspect */
[type="checkbox"]:not(:checked) + label:after,
[type="checkbox"]:checked + label:after {
  content: "✓";
  position: absolute;
  top: 0.4rem;
  left: 0.001rem;
  font-size: 2rem;
  color: black;
  line-height: 0;
}

/* checked mark aspect changes */
[type="checkbox"]:not(:checked) + label:after {
  opacity: 0;
}

[type="checkbox"]:checked + label:after {
  opacity: 1;
}

/* Disabled checkbox */
[type="checkbox"]:disabled:not(:checked) + label:before,
[type="checkbox"]:disabled:checked + label:before {
  box-shadow: none;
  border-color: #bbb;
  background-color: #e9e9e9;
}

[type="checkbox"]:disabled:checked + label:after {
  color: #777;
}

[type="checkbox"]:disabled + label {
  color: #aaa;
}
</style>
