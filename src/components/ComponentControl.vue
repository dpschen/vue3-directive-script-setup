<!--
  Component Control
  This component is just a helper that provides buttons as well as slot props that make
  it possible to toggle v-if and v-show of some element inside the slot.
-->


<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  }
})

const mount = ref(true);
function toggleComponent() {
  mount.value = !mount.value;

  // reset v-show for convenience
  if (mount.value === true) {
    show.value = true;
  }
}

const show = ref(true);

function toggleComponentDisplay() {
  show.value = !show.value;
}
</script>

<template>
  <div>
    <h2>{{title}}</h2>
    <p>
      <button type="button" @click="toggleComponent()">
        {{ mount ? 'Remove' : 'Add' }}
      </button> <pre>v-if="{{mount}}"</pre>
    </p>
    <p>
      <button type="button" @click="toggleComponentDisplay()">
        {{ show ? 'Hide' : 'Show' }}
      </button>
      <pre>v-show="{{show}}"</pre>
    </p>

    <slot v-bind="{ mount, show }">
    </slot>
  </div>
</template>

<style lang="scss" scoped>
p {
  display: flex;
  gap: 1rem;
  align-items: center;

  > * + * {
    flex: 1;
  }
}

button {
  appearance: none;
  border: 2px solid #ccc;
  font: inherit;

  padding: 0.5rem;
  min-width: 6rem;
}

button + button {
  margin-left: 1rem;
}

pre {
  display: inline;
}
</style>