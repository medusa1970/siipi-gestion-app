<template>
  <NuxtLayout name="cathering">
    <h1>En progreso</h1>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTesoreria } from './tesoreria.composable';
const { estado, store, authStore, router } = useTesoreria();

provide('infoPagina', {
  titulo: 'Gestion de tesoreria',
  camino: [{ label: 'Tesoreria', to: 'tesoreria' }],
});
</script>
