<script setup>
import ComponentControl from './components/ComponentControl.vue';
import ComponentWithDirective from './components/ComponentWithDirective.vue';
</script>

<template>
  <h1>Vue 3 – directive with composition api</h1>

  <ComponentControl
    title="Control component that has directive inside"
    #default="{ mount, show }"
  >
    <!-- directive is mounted inside here -->
    <ComponentWithDirective v-if="mount" v-show="show" />
  </ComponentControl>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
</style>
