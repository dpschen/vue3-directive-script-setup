import { createApp, ref, watchEffect } from 'vue';
import App from './App.vue';
import { createDirectiveScope } from './directive.js';

const app = createApp(App);

const { createSetup, useDirectiveHooks } = createDirectiveScope();

app.directive(
  'test',
  createSetup((...args) => {
    const {
      onBeforeMount,
      onMounted,
      onBeforeUpdate,
      onUpdated,
      onBeforeUnmount,
      onUnmounted,
    } = useDirectiveHooks();

    console.log('setup', JSON.parse(JSON.stringify(args)));

    console.log('setup aka created');
    onBeforeMount(() => console.log('beforeMount'));
    onMounted(() => console.log('mounted'));
    onBeforeUpdate(() => console.log('beforeUpdate'));
    onUpdated(() => console.log('updated'));
    onBeforeUnmount(() => console.log('beforeUnmount'));
    onUnmounted(() => console.log('unmounted'));

    // you can log a second time
    onMounted(() => console.log('mounted2'));
    onBeforeMount(() => console.log('beforeMount2'));

    // reactive works
    const foo = ref(2);
    onBeforeUpdate(() => {
      foo.value = foo.value * 2;
    });
    // should be doubled
    watchEffect(() => console.log(foo.value));

    // should be undfined
    onUnmounted(() => console.log(foo.value));
  })
);

app.mount('#app');
