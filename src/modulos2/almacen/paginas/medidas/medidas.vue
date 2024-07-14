<template>
  <Navigation2
    :nav="[
      {
        label: 'medidas',
        to: 'medidas2',
      },
    ]"
    titulo="Gestion de medidas"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});
</script>

<style lang="scss" scoped></style>
