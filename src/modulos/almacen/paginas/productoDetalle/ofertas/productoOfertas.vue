<template>
  <div>En desarollo.</div>
  <div>Aqui se van a ver todas las ofertas de un producto.</div>
</template>

<script setup lang="ts">
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();
const { $socket } = useNuxtApp();
</script>

<style lang="scss" scoped></style>
