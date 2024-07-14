<template>
  <Navigation2
    :nav="[
      {
        label: 'proveedores',
        to: 'proveedores2',
      },
    ]"
    titulo="Gestion de proveedores"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});
</script>

<style lang="scss" scoped></style>
