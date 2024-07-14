<template>
  <Navigation2
    :nav="[
      {
        label: 'marcas',
        to: 'marcas2',
      },
    ]"
    titulo="Gestion de marcas"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});

const router = useRouter();
</script>

<style lang="scss" scoped></style>
