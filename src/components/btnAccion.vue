<template>
  <!-- @eslint-disable-next-line -->
  <q-btn
    :icon="icon"
    class="p-1"
    :color="color"
    size="sm"
    @click="$emit('accion-click')" />
</template>

<script setup lang="ts">
const props = defineProps({
  icono: String,
  click: Function
});
const [icon, color] = props.icono.split(' ');
const emits = defineEmits(['accion-click']); // Define the custom event
</script>
