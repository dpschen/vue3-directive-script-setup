<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue';

defineProps({
  msg: String,
});

const hasMessage = ref(true);
function toggleVIf() {
  hasMessage.value = !hasMessage.value;
}

const showMessage = ref(true);
function toggleVShow() {
  showMessage.value = !showMessage.value;
}

onBeforeMount(() => console.log('composition', 'onBeforeMount'));
onMounted(() => console.log('composition', 'onMounted'));
onBeforeUpdate(() => console.log('composition', 'onBeforeUpdate'));
onUpdated(() => console.log('composition', 'onUpdated'));
onBeforeUnmount(() => console.log('composition', 'onBeforeUnmount'));
onUnmounted(() => console.log('composition', 'onUnmounted'));
</script>

<template>
  <button type="button" @click="toggleVIf">Toggle v-if</button>
  <button type="button" @click="toggleVShow">Toggle v-show</button>

  <h1 v-if="hasMessage" v-show="showMessage" v-test="'bla'">{{ msg }}</h1>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
