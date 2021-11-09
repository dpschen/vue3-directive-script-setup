import { effectScope, ref, shallowRef, shallowReactive } from 'vue';

const DEFAULT_BINDING = {
  instance: null,
  value: undefined,
  oldValue: undefined,
  arg: undefined,
  modifiers: undefined,
  dir: undefined,
};

const DEFAULT_HOOK_FNS = {
  beforeMount: [],
  mounted: [],
  beforeUpdate: [],
  updated: [],
  beforeUnmount: [],
  unmounted: [],
};

export function createDirectiveScope() {
  let scope = null;

  const el = ref(null);
  const binding = shallowReactive({ ...DEFAULT_BINDING });
  const vnode = shallowRef(null);
  const prevVnode = shallowRef(null);

  const getDefaultHookFns = () => ({ ...DEFAULT_HOOK_FNS });

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
        el.value = args[0];
        Object.assign(binding, args[1] || {});
        vnode.value = args[2];
        prevVnode.value = args[3];

        // console.log(hook, 'vnode', vnode.value);
        // console.log(hook, 'prevVnode', prevVnode.value);

        const hookArgs = [];
        vnode.value && hookArgs.push(vnode);
        prevVnode.value && hookArgs.push(prevVnode);

        hookFns[hook].forEach((fn) => fn(...hookArgs));
      });
    };
  }

  function createCreatedHook(setupFn) {
    return (...args) => {
      el.value = args[0];
      Object.assign(binding, args[1]);
      vnode.value = args[2];
      prevVnode.value = args[3];

      // console.log('created', 'vnode', vnode.value);
      // console.log('created', 'prevVnode', prevVnode.value);

      scope = effectScope();
      scope.run(() =>
        setupFn(el, binding, vnode, prevVnode, {
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
    prevVnode.value = args[3];

    // console.log('unmounted', 'vnode', vnode.value);
    // console.log('unmounted', 'prevVnode', prevVnode.value);

    createHook('unmounted')();

    // to dispose all effects in the scope
    scope.stop();
    scope = null;

    // reset hookFns
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
