<template>
  <div>
    <Navigation2
      :nav="[{ label: 'categorias', to: 'categorias' }]"
      titulo="Gestion de categorias" />
  </div>
</template>

<script setup>
// layout
definePageMeta({
  layout: 'cathering'
});
</script>

<style lang="scss" scoped></style>
