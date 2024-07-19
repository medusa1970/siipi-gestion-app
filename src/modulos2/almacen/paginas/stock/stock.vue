<template>
  <Navigation2
    :nav="[
      {
        label: 'stock',
        to: 'stock2',
      },
    ]"
    titulo="Gestion de stocksss"
  />
</template>

<script setup>
definePageMeta({
  layout: 'punto',
});
</script>

<style lang="scss" scoped></style>
