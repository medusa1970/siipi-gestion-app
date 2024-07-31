<template>
  <Navigation2
    :nav="[
      {
        label: 'tesorerias',
        to: 'tesorerias',
      },
    ]"
    titulo="Gestion de tesoreria"
  />

  <h1>En progreso</h1>
</template>

<script setup lang="ts">
// layout
definePageMeta({ layout: 'cathering' });
// import composable, store & estado
import { useTesoreria } from './tesoreria.composable';
const composable = useTesoreria();
const { estado, store } = composable;
// Otros imports
</script>
