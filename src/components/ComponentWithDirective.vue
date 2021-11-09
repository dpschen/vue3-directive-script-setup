<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';

import ComponentControl from './ComponentControl.vue';

// watch the hooks from this component
onBeforeMount(() => console.log('from component', 'onBeforeMount'));
onMounted(() => console.log('from component', 'onMounted'));
onBeforeUpdate(() => console.log('from component', 'onBeforeUpdate'));
onUpdated(() => console.log('from component', 'onUpdated'));
onBeforeUnmount(() => console.log('from component', 'onBeforeUnmount'));
onUnmounted(() => console.log('from component', 'onUnmounted'));
</script>

<template>
  <ComponentControl
    class="directive-component"
    title="Control component with directive in mounted node"
    #default="{ mount, show }"
  >
    <!-- this paragraph node uses the v-test directive -->
    <p v-if="mount" v-show="show" v-test="'bla'">
      This element has a directive
    </p>
  </ComponentControl>
</template>

<style scoped>
.directive-component {
  padding: 1rem;
  background-color: #f2f2f2;
}
</style>
