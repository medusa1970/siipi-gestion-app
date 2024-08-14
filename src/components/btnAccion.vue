<template>
  <!-- @eslint-disable-next-line -->
  <q-btn
    :icon="icon"
    class="p-1"
    :color="color"
    size="sm"
    @click="$emit('accion-click')">
    <q-tooltip v-if="tooltip"> {{ tooltip }} </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
const props = defineProps({
  icono: String,
  click: Function,
  tooltip: String
});
const [icon, color] = props.icono.split(' ');
const emits = defineEmits(['accion-click']); // Define the custom event
</script>
