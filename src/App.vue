<script setup>
import { ref } from 'vue';

import ComponentWithDirective from './ComponentWithDirective.vue';

const hasComponent = ref(true);
function toggleComponent() {
  hasComponent.value = !hasComponent.value;
}

const showComponent = ref(true);

function toggleComponentVisibility() {
  showComponent.value = !showComponent.value;
}
</script>

<template>
  <button type="button" @click="toggleComponentVisibility()">
    {{ hasComponent ? 'Remove' : 'Add' }}
  </button>

  <button type="button" @click="toggleComponent()">
    {{ showComponent ? 'Hide' : 'Show' }}
  </button>
  <button type="button"></button>

  <ComponentWithDirective />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
