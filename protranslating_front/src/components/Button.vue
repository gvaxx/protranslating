<template>
  <button
    href="#"
    role="button"
    :class="'default ' + buttonClass"
    v-on:click="$emit('click')"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "Button",

  props: {
    text: {
      type: String,
      default: "text",
    },
    buttonClass: {
      type: String,
      default: "",
    },
    clickData: Object,
    type: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
button {
  width: 100%;
}
.default {
  font-weight: bold;
  display: inline-block;
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
  padding: 4px 4px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
  color: gray;
  font-size: 0.9rem;
  line-height: 1.8;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition: 0.1s linear all;
}
.danger {
  background-color: #c43c35;
  background-repeat: repeat-x;
  color: white;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #ee5f5b),
    color-stop(100%, #c43c35)
  );
  background-image: -webkit-linear-gradient(top, #ee5f5b, #c43c35);
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
  border-color: #c43c35 #c43c35 #882a25;
  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
}
.default:active:enabled {
  box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
}

.default:hover:enabled {
  background-position: 0 -15px;
  color: #333333;
  text-decoration: none;
}

button:disabled,
button[disabled] {
  cursor: not-allowed;
}
</style>
