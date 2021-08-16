<template>
  <div class="row-input">
    <label :for="inputId" class="label-input"
      ><b>{{ label }}</b></label
    >
    <div :class="inputClass">
      <div>
        <input
          :type="type || 'text'"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
          @change="$emit('change', $event.target.value)"
          :id="inputId"
        />
        <div class="invalid" v-if="invalidText">{{ invalidText }}</div>
      </div>
      <div v-if="buttonEnabled" class="confirm-button">
        <Button @click="$emit('click')" :text="buttonText" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button";
export default {
  name: "Input",
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    buttonEnabled: {
      type: String,
      default: "",
    },
    inputId: {
      type: String,
      default: "",
    },
    invalidText: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
  },
  components: { Button },

  computed: {
    inputClass() {
      return this.buttonEnabled ? "with-button" : "";
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
label {
  font-weight: bold;
  text-align: right;
  margin: auto 0px;
}
.label-input {
  grid-column: 1 / 2;
}

.with-button {
  display: grid;
  column-gap: 10px;
  grid-template-columns: 2fr 1fr;
}

input {
  width: 100%;
  border-radius: 5px;
  border-style: solid;
  font-size: 1rem;
  padding-left: 10px;
  line-height: 2rem;
}
.row-input {
  line-height: 1.7;
  column-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  padding-bottom: 25px;
}
.invalid {
  width: 100%;
  font-size: 0.75em;
  color: #dc3545;
  text-align: left;
  margin-bottom: -20px;
  padding-left: 10px;
}
</style>
