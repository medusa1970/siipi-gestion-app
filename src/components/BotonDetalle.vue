<template>
  <q-btn :color="colorBtn" icon="warning" dense flat round :size="size"
    ><q-popup-edit
      :cover="false"
      anchor="bottom right"
      self="top right"
      class="px-2 py-1"
    >
      <div class="max-w-[200px]">
        <h1>{{ mensaje }}</h1>
      </div>
    </q-popup-edit></q-btn
  >
</template>

<script setup>
defineProps({
  mensaje: String,
  colorBtn: {
    type: String,
    default: 'orange',
  },
  size: {
    type: String,
    default: '13px',
  },
});
</script>
