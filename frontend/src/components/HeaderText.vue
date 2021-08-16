<template>
  <h2>{{ text }}</h2>
</template>

<script>
export default {
  name: "HeaderText",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
h2 {
  color: dodgerblue;
}
</style>
