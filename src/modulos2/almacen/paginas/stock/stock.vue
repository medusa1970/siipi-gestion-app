<template>
  <Navigation2
    :nav="[
      {
        label: 'stock',
        to: 'stock2',
      },
    ]"
    titulo="Gestion de stocks"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});
</script>

<style lang="scss" scoped></style>
