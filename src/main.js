import { createApp, ref, watchEffect } from 'vue';
import App from './App.vue';
import { createDirectiveScope } from './directive.js';

const app = createApp(App);

const { createSetup, useDirectiveHooks } = createDirectiveScope();

// adding custom directive while using the createSetup function
app.directive(
  'test',
  createSetup((...args) => {
    // normal vue component hooks won't work, but these will
    // you might need to rename them on import if you use
    // the vue component hooks in the same file
    const {
      onBeforeMount,
      onMounted,
      onBeforeUpdate,
      onUpdated,
      onBeforeUnmount,
      onUnmounted,
    } = useDirectiveHooks();

    // you get el, binding, vnode, prevVnode as args
    console.log('setup', JSON.parse(JSON.stringify(args)));

    // watch all hooks of the directive
    console.log('setup aka created');
    onBeforeMount(() => console.log('beforeMount'));
    onMounted(() => console.log('mounted'));
    onBeforeUpdate(() => console.log('beforeUpdate'));
    onUpdated(() => console.log('updated'));
    onBeforeUnmount(() => console.log('beforeUnmount'));
    onUnmounted(() => console.log('unmounted'));

    // you can use the hooks as often as you want
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
    onUnmounted(() => console.log("Logging foo on 'unmounted'", foo.value));
  })
);

app.mount('#app');
