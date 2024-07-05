<template>
  <q-btn :color="colorBtn" :icon="iconBtn" dense flat round :size="size"
    ><q-popup-edit
      :cover="false"
      anchor="bottom right"
      self="top right"
      class="px-2 py-1"
      style="height: auto"
    >
      <div class="max-w-[200px]">{{ mensaje }}</div>
    </q-popup-edit>
  </q-btn>
</template>

<script setup>
defineProps({
  mensaje: String,
  colorBtn: { type: String, default: 'blue' },
  iconBtn: { type: String, default: 'info' },
  size: { type: String, default: '13px' },
});
</script>
