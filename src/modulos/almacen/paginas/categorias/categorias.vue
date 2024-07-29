<template>
  <div>
    <Navigation2
      :nav="[{ label: 'categorias', to: 'categorias' }]"
      titulo="Gestion de categorias" />
  </div>
</template>

<script setup>
import { useCategoria } from './categoria.composable';

// layout
definePageMeta({
  layout: 'cathering'
});

const { buscarCategorias } = useCategoria();

onMounted(() => {
  buscarCategorias();
});
</script>

<style lang="scss" scoped></style>
