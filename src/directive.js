import { effectScope, ref, shallowRef, shallowReactive } from 'vue';

export function createDirectiveScope() {
  console.log('createDirectiveScope');

  let scope = null;

  const el = ref(null);
  const binding = shallowReactive({
    instance: null,
    value: undefined,
    oldValue: undefined,
    arg: undefined,
    modifiers: undefined,
    dir: undefined,
  });
  const vnode = shallowRef(null);
  const prevNode = shallowRef(null);

  const getDefaultHookFns = () => ({
    beforeMount: [],
    mounted: [],
    beforeUpdate: [],
    updated: [],
    beforeUnmount: [],
    unmounted: [],
  });

  const hookFns = getDefaultHookFns();

  function pushHookFns(hookName) {
    return (fn) => hookFns[hookName].push(fn);
  }

  const onBeforeDirectiveMount = pushHookFns('beforeMount');
  const onDirectiveMounted = pushHookFns('mounted');
  const onBeforeDirectiveUpdate = pushHookFns('beforeUpdate');
  const onDirectiveUpdated = pushHookFns('updated');
  const onBeforeDirectiveUnmount = pushHookFns('beforeUnmount');
  const onDirectiveUnmounted = pushHookFns('unmounted');

  function createHook(hook) {
    return (...args) => {
      scope.run(() => {
        const hookArgs = [];

        el.value = args[0];
        Object.assign(binding, args[1] || {});
        vnode.value = args[2];
        prevNode.value = args[3];

        console.log(hook, 'vnode', vnode.value);
        console.log(hook, 'prevNode', prevNode.value);

        vnode.value && hookArgs.push(vnode);
        prevNode.value && hookArgs.push(prevNode);

        hookFns[hook].forEach((fn) => fn(...hookArgs));
      });
    };
  }

  function createCreatedHook(setupFn) {
    return (...args) => {
      el.value = args[0];
      Object.assign(binding, args[1]);
      vnode.value = args[2];
      prevNode.value = args[3];

      console.log('created', 'vnode', vnode.value);
      console.log('created', 'prevNode', prevNode.value);

      scope = effectScope();
      // scope.run(() => setupFn(...args));
      scope.run(() =>
        setupFn(el, binding, vnode, prevNode, {
          onBeforeMount: onBeforeDirectiveMount,
          onMounted: onDirectiveMounted,
          onBeforeUpdate: onBeforeDirectiveUpdate,
          onUpdated: onDirectiveUpdated,
          onBeforeUnmount: onBeforeDirectiveUnmount,
          onUnmounted: onDirectiveUnmounted,
        })
      );
    };
  }

  function unmounted(...args) {
    el.value = args[0];
    Object.assign(binding, args[1] || {});
    vnode.value = args[2];
    prevNode.value = args[3];

    console.log('unmounted', 'vnode', vnode.value);
    console.log('unmounted', 'prevNode', prevNode.value);

    createHook('unmounted')();

    // to dispose all effects in the scope
    scope.stop();
    scope = null;

    Object.assign(hookFns, getDefaultHookFns());
  }

  function createSetup(setupFn) {
    return {
      created: createCreatedHook(setupFn),
      beforeMount: createHook('beforeMount'),
      mounted: createHook('mounted'),
      beforeUpdate: createHook('beforeUpdate'),
      updated: createHook('updated'),
      beforeUnmount: createHook('beforeUnmount'),
      unmounted,
    };
  }

  function useDirectiveHooks() {
    return {
      onBeforeMount: onBeforeDirectiveMount,
      onMounted: onDirectiveMounted,
      onBeforeUpdate: onBeforeDirectiveUpdate,
      onUpdated: onDirectiveUpdated,
      onBeforeUnmount: onBeforeDirectiveUnmount,
      onUnmounted: onDirectiveUnmounted,
    };
  }

  return {
    createSetup,
    useDirectiveHooks,
    stop,
  };
}
