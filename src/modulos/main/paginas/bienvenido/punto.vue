<template>
  <NuxtLayout name="punto">
    <div
      class="flex justify-center items-center backImage"
      style="height: 500px">
      <h1 class="text-lg font-bold">DIOS TE BENDIGA</h1>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();

provide('infoPagina', {
  infoPagina: {
    titulo: 'Bienvenido',
    camino: [{ label: 'bienvenido', to: 'punto' }]
  }
});
</script>
